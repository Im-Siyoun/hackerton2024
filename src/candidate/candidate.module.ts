import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Candidate, CandidateSchema } from './types/candidate.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
    ]),
  ],
  providers: [CandidateService],
  exports: [CandidateService],
})
export class CandidateModule {}
