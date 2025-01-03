// aws.service.ts
import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Video, VideoDocument } from './types/video.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VideoService {
  s3Client: S3Client;
  constructor(
    @InjectModel(Video.name) private VideoModel: Model<VideoDocument>,
  ) {
    // AWS S3 클라이언트 초기화. 환경 설정 정보를 사용하여 AWS 리전, Access Key, Secret Key를 설정.
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION, // AWS Region
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY, // Access Key
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY, // Secret Key
      },
    });
  }

  async videoUploadToS3(
    file: Express.Multer.File, // 업로드할 파일
  ) {
    const ext = file.originalname.split('.').pop();
    const fileName = `${file.originalname}`;
    // AWS S3에 이미지 업로드 명령을 생성합니다. 파일 이름, 파일 버퍼, 파일 접근 권한, 파일 타입 등을 설정합니다.
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME, // S3 버킷 이름
      Key: fileName, // 업로드될 파일의 이름
      Body: file.buffer, // 업로드할 파일
      ACL: 'public-read', // 파일 접근 권한
      ContentType: `video/${ext}`, // 파일 타입
    });

    // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
    await this.s3Client.send(command);

    // 업로드된 이미지의 URL을 반환합니다.
    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
  }

  async createVideoData(data: Video): Promise<Video> {
    const video = await this.VideoModel.create(data);

    return video;
  }
}
