import type { UserUpPl } from 'six__server__pl-types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';

export type { UserUpPl };

/**
 * User input email alias
 */
export type UserInsertOutEmail = UserUpPl['_insert']['Out']['email'];
export type UserInsertPrepareIn = InsertPrepareIn<UserUpPl>;
export type UserInsertPrepareOut = InsertPrepareOut<UserUpPl>;
