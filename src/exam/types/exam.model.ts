import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true, versionKey: false })
export class Exam {
  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty({
    description: '과목명',
    example: '문제해결을위한글쓰기와발표',
  })
  subject: string;

  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty({
    description: '시험명',
    example: '문제해결을위한글쓰기와발표4분반',
  })
  examName: string;

  @Prop({
    type: Date,
    required: true,
  })
  @ApiProperty({
    description: '시험시작시간',
  })
  startTime: Date;

  @Prop({
    type: Date,
    required: true,
  })
  @ApiProperty({
    description: '시험끝시간',
  })
  endTime: Date;

  @Prop({
    type: Boolean,
    required: true,
  })
  @ApiProperty({
    description: 'OCR인증여부',
  })
  OCR: boolean;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  @ApiProperty({
    description: '시험완료여부',
  })
  complete: boolean;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  @ApiProperty({
    description: '랜덤으로 생성되는 방 아이디',
    example: 'awer4g1nuvf',
  })
  roomId: string;
}

export type ExamDocument = Exam & Document;

export const ExamSchema = SchemaFactory.createForClass(Exam);
