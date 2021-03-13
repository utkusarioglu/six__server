import type { UserCommentUpPl } from 'six__server__pl-types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';

export type { UserCommentUpPl };

export type UserCommentInsertPrepareIn = InsertPrepareIn<UserCommentUpPl>;
export type UserCommentInsertPrepareOut = InsertPrepareOut<UserCommentUpPl>;
