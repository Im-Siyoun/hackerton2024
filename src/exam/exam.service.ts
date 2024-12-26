import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam } from './types/exam.model';
import { CreateExamDto } from './types/create-exam.dto';
import { CandidateService } from '../candidate/candidate.service';
import { SubjectService } from 'src/subject/subject.service';

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam.name) private readonly ExamModel: Model<Exam>,
    private readonly subjectservice: SubjectService,
    private readonly candidateservice: CandidateService,
  ) {}

  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async createExam(data: CreateExamDto): Promise<Exam> {
    const roomId = this.generateRandomString(8); // 랜덤으로 8자리 문자열 생성
    const ExamData = {
      ...data,
      roomId: roomId,
    };
    const Exam = await this.ExamModel.create(ExamData);
    return Exam;
  }

  async findAll(): Promise<Exam[]> {
    const Exams = await this.ExamModel.find();

    return Exams;
  }

  async findOne(id: string): Promise<Exam> {
    return await this.ExamModel.findById(id).exec();
  }

  async findOneBySubjectId(id: string): Promise<Exam> {
    const subject = await this.subjectservice.findOne(id);
    if (!subject) {
      throw new NotFoundException('없는 과목 id입니다.');
    }
    return await this.ExamModel.findOne({ subject: subject.subjectName });
  }
}
