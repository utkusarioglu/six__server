import { uuid } from '../../@types/helpers';
import type { CommunityModel } from '../community/community.types';

/**
 * Properties of VisitorCommunity insert that needs to come from
 * the user
 */

export interface VisitorCommunitySubscriptionInsert {
  community_id: CommunityModel['id'];
}

export interface VisitorCommunitySubscriptionSqlAutoInsert {
  id: uuid;
}

export type VisitorCommunitySubscriptionModel = VisitorCommunitySubscriptionInsert &
  VisitorCommunitySubscriptionSqlAutoInsert;
