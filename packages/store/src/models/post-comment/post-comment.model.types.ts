import type { PostCommentUpPl } from 'six__server__pl-types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';

export type { PostCommentUpPl };

export type PostCommentInsertPrepareIn = InsertPrepareIn<PostCommentUpPl>;
export type PostCommentInsertPrepareOut = InsertPrepareOut<PostCommentUpPl>;
