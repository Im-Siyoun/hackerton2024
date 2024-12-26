import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Candidate, CandidateDocument } from './types/candidate.model';
import mongoose, { Model } from 'mongoose';
@Injectable()
export class CandidateService {
  constructor(
    @InjectModel(Candidate.name)
    private CandidateModel: Model<CandidateDocument>,
  ) {}

  async createCandidate(data: Partial<Candidate>): Promise<Candidate> {
    const candidateData = {
      ...data,
      _id: new mongoose.Types.ObjectId(),
    };
    const candidate = await this.CandidateModel.create(candidateData);

    return candidate;
  }

  async findAll(): Promise<Candidate[]> {
    const Candidates = await this.CandidateModel.find();

    return Candidates;
  }

  async findAllByExamId(id: string): Promise<Candidate[]> {
    const Candidates = await this.CandidateModel.find({ examId: id });

    return Candidates;
  }

  async findOne(id: string): Promise<Candidate> {
    const Candidate = await this.CandidateModel.findOne({ id: id });

    return Candidate;
  }

  async updateCandidate(
    id: string,
    data: Partial<Candidate>,
  ): Promise<Candidate> {
    const Candidate = await this.CandidateModel.findByIdAndUpdate(id, data);

    return Candidate;
  }

  async deleteCandidate(id: string): Promise<any> {
    const result = await this.CandidateModel.findByIdAndDelete(id);

    return result;
  }
}
