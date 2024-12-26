import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subject, SubjectDocument } from './types/subject.model';
import mongoose, { Model } from 'mongoose';
@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name)
    private SubjectModel: Model<SubjectDocument>,
  ) {}

  async createSubject(data: Partial<Subject>): Promise<Subject> {
    const subjectData = {
      ...data,
      _id: new mongoose.Types.ObjectId(),
    };
    const subject = await this.SubjectModel.create(subjectData);

    return subject;
  }

  async findAll(): Promise<Subject[]> {
    const Subjects = await this.SubjectModel.find();

    return Subjects;
  }

  async findAllByExamId(id: string): Promise<Subject[]> {
    const Subjects = await this.SubjectModel.find({ examId: id });

    return Subjects;
  }

  async findOne(id: string): Promise<Subject> {
    const Subject = await this.SubjectModel.findOne({ _id: id });

    return Subject;
  }

  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
    const Subject = await this.SubjectModel.findByIdAndUpdate(id, data);

    return Subject;
  }

  async deleteSubject(id: string): Promise<any> {
    const result = await this.SubjectModel.findByIdAndDelete(id);

    return result;
  }
}
