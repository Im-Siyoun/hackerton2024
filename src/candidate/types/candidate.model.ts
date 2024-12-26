import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Candidate {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    ref: 'Exam',
    required: true,
    localField: 'examId',
    foreignField: 'roomId',
  })
  @ApiProperty({
    description: '시험 id',
  })
  examId: string;

  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty({
    description: '랜덤생성되는 응시자의 비밀번호',
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty({
    description: '응시자의 학번',
  })
  studentId: string;
}

export type CandidateDocument = Candidate & Document;

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
