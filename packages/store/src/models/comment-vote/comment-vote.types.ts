import { CommentVotePipeline } from 'six__public-api';
import {
  BuildInsertParams,
  BuildPrepareInsert,
} from '../model/types/model.types';

export type { CommentVotePipeline };

export type CommentVoteInsertParams = BuildInsertParams<CommentVotePipeline>;

export type CommentVoteInput = CommentVotePipeline['_insert']['In'];
export type CommentVotePrepareInsert = BuildPrepareInsert<CommentVotePipeline>;
