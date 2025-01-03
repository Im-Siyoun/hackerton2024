import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ExamModule } from './exam/exam.module';
import { WebrtcModule } from './gateway/webrtc.module';
import { VideoModule } from './video/video.module';
import { ResultModule } from './result/result.module';
import { SubjectModule } from './subject/subject.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    AuthModule,
    ExamModule,
    WebrtcModule,
    VideoModule,
    ResultModule,
    SubjectModule,
  ],
})
export class AppModule {}
