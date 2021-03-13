import type { UserVoteUpPl } from 'six__server__pl-types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';

export type { UserVoteUpPl };

export type UserVoteInsertPrepareIn = InsertPrepareIn<UserVoteUpPl>;
export type UserVoteInsertPrepareOut = InsertPrepareOut<UserVoteUpPl>;
