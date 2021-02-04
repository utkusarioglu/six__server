import type { CommunityPostReq, CommunitySqlAutoSave } from 'six__public-api';

/**
 * Specifies the properties that need to come from the user to
 * create a new community
 */

export interface CommunityInsert {
  /**
   * id of the community
   * ! this is only here for building the thing and shall be taken off before
   * ! production
   * */
  id?: CommunitySqlAutoSave['id'];

  /** description text for the community */
  description: CommunityPostReq['req']['description'];
  /** Community name, cannot have spaces */
  name: CommunityPostReq['req']['name'];
  /** Community slug, used for the uri */
  slug: CommunityPostReq['req']['slug'];
}

export interface CommunityInsertAuto {
  /**
   * id of the community
   * ! this is only here for building the thing and shall be taken off before
   * ! production
   * */
  id: CommunitySqlAutoSave['id'];
  created_at: CommunitySqlAutoSave['createdAt'];
  post_count: CommunitySqlAutoSave['postCount'];
  subscriber_count: CommunitySqlAutoSave['subscriberCount'];
}

export type CommunityModel = CommunityInsert & CommunityInsertAuto;
