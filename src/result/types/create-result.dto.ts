import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateResultDto {
  @ApiProperty({
    example: 'asgwrbed',
    description: '응시자 Id',
  })
  @Expose({ name: 'candidateId' })
  @IsString()
  candidateId: string;

  @ApiProperty({
    example: '{}',
    description: '시험을 마무리 한 후 생성된 응시 데이터',
  })
  @Expose({ name: 'result' })
  @IsString()
  result: object;
}
