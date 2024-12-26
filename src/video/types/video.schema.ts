import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Video {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  })
  @ApiProperty({
    description: '응시자',
  })
  candidateId: string;

  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty({
    description: '영상 링크',
  })
  videoURL: string;
}

export type VideoDocument = Video & Document;

export const VideoSchema = SchemaFactory.createForClass(Video);
