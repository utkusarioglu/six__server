import type { VotePipeline } from 'six__public-api';
import {
  BuildInsertParams,
  BuildPrepareInsert,
} from '../model/types/model.types';

export type { VotePipeline };

export type VoteInput = VotePipeline['_insert']['In'];
export type VoteInsertParams = BuildInsertParams<VotePipeline>;
export type VotePrepareInsert = BuildPrepareInsert<VotePipeline>;
