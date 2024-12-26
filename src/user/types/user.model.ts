import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty({
    description: '아이디',
  })
  id: string;

  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty({
    description: '비밀번호',
  })
  password: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
