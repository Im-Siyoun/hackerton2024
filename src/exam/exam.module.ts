import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './types/exam.model';
import { CandidateModule } from 'src/candidate/candidate.module';
import { SubjectModule } from 'src/subject/subject.module';

@Module({
  imports: [
    SubjectModule,
    CandidateModule,
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
