import type { UserCommunityCreatorUpPl } from 'six__server__pl-types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';
import type { PickSelectRows } from '../../helpers/model/model.types';

export type { UserCommunityCreatorUpPl };

export type UccPrepareInsertIn = InsertPrepareIn<UserCommunityCreatorUpPl>;
export type UccPrepareInsertOut = InsertPrepareOut<UserCommunityCreatorUpPl>;

export type UccInsertOut = PickSelectRows<UserCommunityCreatorUpPl, 'id'>[];
