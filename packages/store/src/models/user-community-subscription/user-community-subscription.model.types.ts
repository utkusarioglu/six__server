import { Raw } from 'knex';
import type { UserCommunitySubscriptionUpPl } from 'six__server__pl-types';
import type { PickSelectRows } from '../../helpers/model/model.types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';

export type { UserCommunitySubscriptionUpPl };

export type UCSInsertPrepareIn = InsertPrepareIn<UserCommunitySubscriptionUpPl>;
export type UCSInsertPrepareOut = InsertPrepareOut<UserCommunitySubscriptionUpPl>;

export type UCSUserId = UserCommunitySubscriptionUpPl['_db']['Out']['user_id'];

export type UCSCommunityId = PickSelectRows<
  UserCommunitySubscriptionUpPl,
  'community_id',
  { community_id: 'communityId' }
>;

export type UCSCommunityIdColumns = Record<keyof UCSCommunityId, string | Raw>;
