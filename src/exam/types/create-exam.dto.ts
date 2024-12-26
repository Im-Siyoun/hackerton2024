import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class CreateExamDto {
  @ApiProperty({
    example: '문제해결을위한글쓰기와발표',
    description: '과목명',
  })
  @Expose({ name: 'subject' })
  @IsString()
  subject: string;

  @ApiProperty({
    example: '["23011583"]',
    description: '시험 응시자들의 학번 배열',
    type: Array<string>,
  })
  @Expose({ name: 'Candidates' })
  @IsArray()
  Candidates: string[];
}
