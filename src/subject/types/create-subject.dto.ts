import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    example: '문제해결을위한글쓰기와발표',
    description: '과목명',
  })
  @Expose({ name: 'subjectName' })
  @IsString()
  subjectName: string;
}
