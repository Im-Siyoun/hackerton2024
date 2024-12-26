import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateExamDto {
  @ApiProperty({
    example: '문제해결을위한글쓰기와발표',
    description: '과목명',
  })
  @Expose({ name: 'subject' })
  @IsString()
  subject: string;

  @ApiProperty({
    example: '문제해결을위한글쓰기와발표4분반',
    description: '시험명',
  })
  @Expose({ name: 'examName' })
  @IsString()
  examName: string;

  @ApiProperty({
    description: '시험시작시간',
  })
  @Expose({ name: 'startTime' })
  startTime: mongoose.Schema.Types.Date;

  @ApiProperty({
    description: '시험끝시간',
  })
  @Expose({ name: 'endTime' })
  endTime: mongoose.Schema.Types.Date;

  @ApiProperty({
    description: 'OCR인증여부',
  })
  @IsBoolean()
  OCR: boolean;

  @ApiProperty({
    description: '시험완료여부',
  })
  @IsBoolean()
  @IsOptional()
  complete?: boolean;
}
