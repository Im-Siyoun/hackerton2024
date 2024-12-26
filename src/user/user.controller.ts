import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './types/user.model';
import { ResponseDto } from 'src/types/response.dto';
import { CreateUserDto } from './types/create-user.dto';

@ApiTags('사용자 API')
@Injectable()
@Controller('/user')
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @Post()
  @ApiOperation({ summary: '사용자 생성 API' })
  @ApiBody({
    description: '사용자 생성 정보 DTO',
    type: CreateUserDto,
  })
  @ApiResponse({
    type: ResponseDto<User>,
  })
  async createUser(@Body() data: CreateUserDto): Promise<ResponseDto<User>> {
    const result = await this.userservice.createUser(data);
    return ResponseDto.created('create_success', result);
  }

  @Get('/:id')
  @ApiOperation({ summary: '단일 사용자 조회 API' })
  @ApiParam({
    name: 'id',
    type: String,
    description: '사용자 id',
  })
  @ApiResponse({
    type: User,
  })
  async getUser(@Param('id') id: string): Promise<any> {
    const result = await this.userservice.findOne(id);
    return ResponseDto.success('inquiry_success', result);
  }

  @Get()
  @ApiOperation({ summary: '다중 사용자 조회 API' })
  @ApiResponse({
    type: ResponseDto<User[]>,
  })
  async getUsers(): Promise<ResponseDto<User[]>> {
    const result = await this.userservice.findAll();
    return ResponseDto.success('inquiry_success', result);
  }
}
