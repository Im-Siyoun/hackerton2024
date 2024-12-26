import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebrtcService } from './webrtc.service';
import { joinRoomDto } from './types/joinRoom.dto';
import { MessageDto } from './types/message.dto';
import { RTCSessionDescriptionDto } from './types/RTCSession.dto';
import { CandidateDto } from './types/candidate.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class WebrtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  rooms = new Map<string, Set<string>>();

  constructor(private readonly webrtcService: WebrtcService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.rooms.forEach((clients, room) => {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        this.server.to(room).emit('userLeft', { user: client.id });
      }
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: joinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    // 룸에 클라이언트 추가
    if (!this.rooms.has(data.room)) {
      this.rooms.set(data.room, new Set());
    }
    this.rooms.get(data.room).add(client.id);
    client.join(data.room);

    // 현재 룸의 사용자 목록 전송
    const usersInRoom = Array.from(this.rooms.get(data.room));
    client.emit('usersInRoom', usersInRoom);
    client.to(data.room).emit('userJoined', { user: client.id });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // 클라이언트가 속한 룸 찾기
    console.log(data);
    let clientRoom: string;
    this.rooms.forEach((clients, room) => {
      if (clients.has(client.id)) {
        clientRoom = room;
      }
    });
    console.log(clientRoom)

    if (clientRoom) {
      // 스트림 데이터를 룸의 다른 클라이언트들에게 브로드캐스트
      this.server.to(clientRoom).emit('streamData', {
        data: data,
      });
    }
  }

  @SubscribeMessage('track')
  handleTrack(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    let clientRoom: string;
    this.rooms.forEach((clients, room) => {
      if (clients.has(client.id)) {
        clientRoom = room;
      }
    });

    if (clientRoom) {
      this.server.to(clientRoom).emit('track', {
        sender: client.id,
        track: data,
      });
    }
  }
}
