import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam } from './types/exam.model';
import { CreateExamDto } from './types/create-exam.dto';
import { CandidateService } from '../candidate/candidate.service';

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam.name) private readonly ExamModel: Model<Exam>,
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
      subject: data.subject,
      roomId: roomId,
      Candidates: [],
    };
    await Promise.all(
      data.Candidates.map(async (candidate) => {
        const result = await this.candidateservice.createCandidate({
          examId: roomId,
          password: this.generateRandomString(8), // 랜덤으로 8자리 문자열 생성
          studentId: candidate,
        });
        ExamData.Candidates.push(result._id);
      }),
    );
    console.log(ExamData);
    const Exam = await this.ExamModel.create(ExamData);
    console.log(Exam);
    return Exam;
  }

  async findAll(): Promise<Exam[]> {
    const Exams = await this.ExamModel.find();

    return Exams;
  }

  async findOne(id: string): Promise<Exam> {
    return this.ExamModel.findById(id).exec();
  }
}
