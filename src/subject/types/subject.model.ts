import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true, versionKey: false })
export class Subject {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  @ApiProperty({
    description: '과목명',
    example: '문제해결을위한글쓰기와발표',
  })
  subjectName: string;
}

export type SubjectDocument = Subject & Document;

export const SubjectSchema = SchemaFactory.createForClass(Subject);
