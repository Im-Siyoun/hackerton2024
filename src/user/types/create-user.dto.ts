import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '김도완',
    description: '사용자의 이름입니다.',
  })
  @Expose({ name: 'name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'rlatldbs',
    description: '사용자의 아이디입니다.',
  })
  @Expose({ name: 'id' })
  @IsString()
  id: string;

  @ApiProperty({
    example: '1234qwer',
    description:
      '사용자의 비밀번호입니다. 단방향 암호화따윈 하지 않습니다. 시간낭비니까요!',
  })
  @Expose({ name: 'password' })
  @IsString()
  password: string;
}
