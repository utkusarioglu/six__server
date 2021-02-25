import type { UserContentPipeline } from 'six__public-api';
import {
  BuildInsertParams,
  BuildPrepareInsert,
} from '../model/types/model.types';

export type { UserContentPipeline };

export type UserContentInput = UserContentPipeline['_insert']['In'];
export type UserContentPrepareInsert = BuildPrepareInsert<UserContentPipeline>;
export type UserContentInsertFunc = BuildInsertParams<UserContentPipeline>;
