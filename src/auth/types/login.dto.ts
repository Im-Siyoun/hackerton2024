import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'aewhjvsd',
    description: '유저 아이디입니다.',
  })
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty({
    example: '1234qwer',
    description: '유저 비밀번호입니다.',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
