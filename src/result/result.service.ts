import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './types/create-result.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Result, ResultDocument } from './types/result.model';
import { Model } from 'mongoose';
@Injectable()
export class ResultService {
  constructor(
    @InjectModel(Result.name) private ResultModel: Model<ResultDocument>,
  ) {}

  async createResult(data: CreateResultDto): Promise<Result> {
    const Result = await this.ResultModel.findOneAndUpdate(
      { candidateId: data.candidateId },
      data,
      { upsert: true },
    );

    return Result;
  }

  async findAll(): Promise<Result[]> {
    const Results = await this.ResultModel.find({}).sort({ candidateId: 1 });

    return Results;
  }

  async findOne(id: string): Promise<Result> {
    const Result = await this.ResultModel.findOne({ id: id });

    return Result;
  }

  async updateResult(
    id: string,
    data: Partial<CreateResultDto>,
  ): Promise<Result> {
    const Result = await this.ResultModel.findByIdAndUpdate(id, data);

    return Result;
  }

  async deleteResult(id: string): Promise<any> {
    const result = await this.ResultModel.findByIdAndDelete(id);

    return result;
  }
}
