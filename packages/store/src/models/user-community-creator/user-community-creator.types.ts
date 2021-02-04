import type { UserGetRes } from 'six__public-api';
import { uuid } from '../../@types/helpers';
import type { CommunityModel } from '../community/community.types';

/**
 * Defines the properties that need to be supplied for the user to insert an
 * UserCommunityCreator entry
 */
export interface UserCommunityCreatorInsert {
  user_id: UserGetRes['res']['id'];
  community_id: CommunityModel['id'];
}

export interface UserCommunityCreatorSqlAutoInsert {
  id: uuid;
}

export type UserCommunityCreatorModel = UserCommunityCreatorInsert &
  UserCommunityCreatorSqlAutoInsert;
