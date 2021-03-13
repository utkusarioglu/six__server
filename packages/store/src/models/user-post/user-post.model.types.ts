import type { UserPostUpPl } from 'six__server__pl-types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';

export type { UserPostUpPl };

export type UserPostInsertPrepareIn = InsertPrepareIn<UserPostUpPl>;
export type UserPostInsertPrepareOut = InsertPrepareOut<UserPostUpPl>;
