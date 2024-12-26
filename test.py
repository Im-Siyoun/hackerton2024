import asyncio
import socketio
import cv2
import dlib
import numpy as np
import mediapipe as mp
import ffmpeg
from io import BytesIO
import csv
import time

SERVER_URL = "http://43.203.31.163:3000"

# Socket.IO 클라이언트 생성
sio = socketio.AsyncClient(
    ssl_verify=False,  # ngrok https 연결을 위해
    engineio_logger=True  # 디버깅을 위한 로깅
)

async def connect_to_server():
    try:
        await sio.connect(
            SERVER_URL,
            transports=['websocket'],
            headers={'Content-Type': 'application/json'}
        )
        await sio.emit('joinRoom', {'room': 'testRoom'})
    except Exception as e:
        print(f"Connection error: {e}")

@sio.event
async def connect():
    print("Socket.IO connected!")

@sio.event
async def disconnect():
    print("Socket.IO disconnected!")

@sio.on("usersInRoom")
async def on_users_in_room(data):
    print(f"Users in room: {data}")

@sio.on("userJoined")
async def on_user_joined(data):
    print(f"User joined: {data['user']}")

@sio.on("streamData")
async def on_track(track):
    try:
        # WebM 데이터를 디코딩하여 OpenCV에서 처리 가능한 프레임으로 변환
        webm_data = track['data']['stream']
        frames = decode_webm_to_frames(webm_data)
        
        for frame in frames:
            process_frame(frame)
    except Exception as e:
        print(f"Error processing streamData: {e}")

# WebM 데이터를 디코딩하는 함수
def decode_webm_to_frames(webm_data):
    input_stream = BytesIO(webm_data)
    process = (
        ffmpeg.input("pipe:0", format="webm")
        .output("pipe:1", format="rawvideo", pix_fmt="bgr24")
        .run_async(pipe_stdin=True, pipe_stdout=True, pipe_stderr=True)
    )
    stdout, _ = process.communicate(input_stream.read())
    frame_size = 640 * 480 * 3  # 예: 해상도 640x480, RGB
    frames = [
        np.frombuffer(stdout[i:i+frame_size], dtype=np.uint8).reshape((480, 640, 3))
        for i in range(0, len(stdout), frame_size)
    ]
    return frames

# 얼굴 및 손 탐지 초기화
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

# 데이터 처리 함수
yaw_list, pitch_list, roll_list, hand_visible_list = [], [], [], []
start_time = time.time()

MODEL_POINTS = np.array([
    (0.0, 0.0, 0.0),
    (0.0, -330.0, -65.0),
    (-225.0, 170.0, -135.0),
    (225.0, 170.0, -135.0),
    (-150.0, -150.0, -125.0),
    (150.0, -150.0, -125.0)
], dtype=np.float32)
FOCAL_LENGTH = 600.0
CAMERA_MATRIX = np.array([[FOCAL_LENGTH, 0, 320], [0, FOCAL_LENGTH, 240], [0, 0, 1]], dtype=np.float32)
DIST_COEFFS = np.zeros((4, 1))

def get_2d_image_points(shape):
    return np.array([
        (shape.part(30).x, shape.part(30).y),
        (shape.part(8).x, shape.part(8).y),
        (shape.part(36).x, shape.part(36).y),
        (shape.part(45).x, shape.part(45).y),
        (shape.part(48).x, shape.part(48).y),
        (shape.part(54).x, shape.part(54).y)
    ], dtype=np.float32)

def draw_landmarks(frame, shape):
    for i in range(68):
        x, y = shape.part(i).x, shape.part(i).y
        cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

def process_frame(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)
    for face in faces:
        shape = predictor(gray, face)
        draw_landmarks(frame, shape)
        image_points = get_2d_image_points(shape)
        _, rotation_vector, _ = cv2.solvePnP(MODEL_POINTS, image_points, CAMERA_MATRIX, DIST_COEFFS)
        rotation_matrix, _ = cv2.Rodrigues(rotation_vector)
        yaw, pitch, roll = rotation_matrix.flatten()
        yaw_list.append(yaw)
        pitch_list.append(pitch)
        roll_list.append(roll)

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)
    if results.multi_hand_landmarks:
        hand_visible_list.append(1)
        for hand_landmarks in results.multi_hand_landmarks:
            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
    else:
        hand_visible_list.append(0)

    cv2.imshow("Face and Hand Tracking", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        return

async def main():
    await connect_to_server()
    await asyncio.sleep(3600)

if __name__ == "__main__":
    asyncio.run(main())
