import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { ResultService } from './result.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Result } from './types/result.model';
import { ResponseDto } from 'src/types/response.dto';
import { CreateResultDto } from './types/create-result.dto';

@ApiTags('결과 API')
@Injectable()
@Controller('/result')
export class ResultController {
  constructor(private readonly resultservice: ResultService) {}

  @Post()
  @ApiOperation({ summary: '결과 생성 API' })
  @ApiBody({
    description: '결과 생성 정보 DTO',
    type: CreateResultDto,
  })
  @ApiResponse({
    type: ResponseDto<Result>,
  })
  async createResult(
    @Body() data: CreateResultDto,
  ): Promise<ResponseDto<Result>> {
    const result = await this.resultservice.createResult(data);
    return ResponseDto.created('create_success', result);
  }

  @Get('/:id')
  @ApiOperation({ summary: '단일 결과 조회 API' })
  @ApiParam({
    name: 'id',
    type: String,
    description: '결과 id',
  })
  @ApiResponse({
    type: Result,
  })
  async getResult(@Param('id') id: string): Promise<any> {
    const result = await this.resultservice.findOne(id);
    return ResponseDto.success('inquiry_success', result);
  }

  @Get()
  @ApiOperation({ summary: '다중 결과 조회 API' })
  @ApiResponse({
    type: ResponseDto<Result[]>,
  })
  async getResults(): Promise<ResponseDto<Result[]>> {
    const result = await this.resultservice.findAll();
    return ResponseDto.success('inquiry_success', result);
  }
}
