import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Subject } from './types/subject.model';
import { ResponseDto } from 'src/types/response.dto';
import { CreateSubjectDto } from './types/create-subject.dto';

@ApiTags('과목 관리 API')
@Injectable()
@Controller('/subject')
export class SubjectController {
  constructor(private readonly subjectservice: SubjectService) {}

  @Post()
  @ApiOperation({ summary: '과목 생성 API' })
  @ApiBody({
    description: '과목 생성 정보 DTO',
    type: CreateSubjectDto,
  })
  @ApiResponse({
    type: ResponseDto<Subject>,
  })
  async createSubject(
    @Body() data: CreateSubjectDto,
  ): Promise<ResponseDto<Subject>> {
    const result = await this.subjectservice.createSubject(data);
    return ResponseDto.created('create_success', result);
  }

  @Get('/:id')
  @ApiOperation({ summary: '단일 과목 조회 API' })
  @ApiParam({
    name: 'id',
    type: String,
    description: '과목 id',
  })
  @ApiResponse({
    type: Subject,
  })
  async getSubject(@Param('id') id: string): Promise<any> {
    const result = await this.subjectservice.findOne(id);
    return ResponseDto.success('inquiry_success', result);
  }

  @Get()
  @ApiOperation({ summary: '다중 과목 조회 API' })
  @ApiResponse({
    type: ResponseDto<Subject[]>,
  })
  async getSubjects(): Promise<ResponseDto<Subject[]>> {
    const result = await this.subjectservice.findAll();
    return ResponseDto.success('inquiry_success', result);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '단일 과목 삭제 API' })
  @ApiParam({
    name: 'id',
    type: String,
    description: '과목 id',
  })
  @ApiResponse({
    type: ResponseDto<Subject>,
  })
  async DeleteSubject(@Param() id: string): Promise<any> {
    const result = await this.subjectservice.deleteSubject(id);
    return ResponseDto.success('delete_success', result);
  }
}
