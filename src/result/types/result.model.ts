import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true, versionKey: false })
export class Result {
  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty({
    description: '응시자 Id',
    example: 'asefjvdse',
  })
  candidateId: string;

  @Prop({
    type: Object,
    required: true,
  })
  @ApiProperty({
    description: '시험을 마무리 한 후 생성된 응시 데이터',
  })
  result: string;
}

export type ResultDocument = Result & Document;

export const ResultSchema = SchemaFactory.createForClass(Result);
