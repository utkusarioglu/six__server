import type { PostVoteUpPl } from 'six__server__pl-types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';

export type { PostVoteUpPl };

export type PostVoteInsertPrepareIn = InsertPrepareIn<PostVoteUpPl>;
export type PostVoteInsertPrepareOut = InsertPrepareOut<PostVoteUpPl>;
