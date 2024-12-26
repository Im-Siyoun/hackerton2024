import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { ExamService } from './exam.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Exam } from './types/exam.model';
import { ResponseDto } from 'src/types/response.dto';
import { CreateExamDto } from './types/create-exam.dto';

@ApiTags('시험 관리 API')
@Injectable()
@Controller('/exam')
export class ExamController {
  constructor(private readonly examservice: ExamService) {}

  @Post()
  @ApiOperation({ summary: '시험 방 생성 API' })
  @ApiBody({
    description: '시험 생성 정보 DTO',
    type: CreateExamDto,
  })
  @ApiResponse({
    type: ResponseDto<Exam>,
  })
  async createExam(@Body() data: CreateExamDto): Promise<ResponseDto<Exam>> {
    const result = await this.examservice.createExam(data);
    return ResponseDto.created('create_success', result);
  }

  @Get('/:id')
  @ApiOperation({ summary: '단일 시험 조회 API' })
  @ApiParam({
    name: 'id',
    type: String,
    description: '시험 id',
  })
  @ApiResponse({
    type: Exam,
  })
  async getExam(@Param('id') id: string): Promise<any> {
    const result = await this.examservice.findOne(id);
    return ResponseDto.success('inquiry_success', result);
  }

  @Get()
  @ApiOperation({ summary: '다중 시험 조회 API' })
  @ApiResponse({
    type: ResponseDto<Exam[]>,
  })
  async getExams(): Promise<ResponseDto<Exam[]>> {
    const result = await this.examservice.findAll();
    return ResponseDto.success('inquiry_success', result);
  }
}
