import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

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
    unique: true,
  })
  @ApiProperty({
    description: '랜덤으로 생성되는 방 아이디',
    example: 'awer4g1nuvf',
  })
  roomId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidates',
  })
  @ApiProperty({
    description: '응시자들의 고유 _id 목록',
    type: [String],
  })
  Candidates: mongoose.Schema.Types.ObjectId[];
}

export type ExamDocument = Exam & Document;

export const ExamSchema = SchemaFactory.createForClass(Exam);
