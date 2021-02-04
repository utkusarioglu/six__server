import type { UserGetRes } from 'six__public-api';
import { uuid } from '../../@types/helpers';
import type { CommunityModel } from '../community/community.types';

/**
 * Defines the properties that need to be supplied by the user to insert a
 * UserCommunitySubscription entry
 */

export interface UserCommunitySubscriptionInsert {
  user_id: UserGetRes['res']['id'];
  community_id: CommunityModel['id'];
}

export interface UserCommunitySubscriptionSqlAutoInsert {
  id: uuid;
}

export type UserCommunitySubscriptionModel = UserCommunitySubscriptionInsert &
  UserCommunitySubscriptionSqlAutoInsert;
