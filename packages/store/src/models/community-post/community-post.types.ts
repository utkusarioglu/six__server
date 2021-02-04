import { uuid } from '../../@types/helpers';
import type { CommunityModel } from '../community/community.types';
import type { PostModel } from '../post/post.types';

/**
 * Defines the properties of CommunityPosts that need to come from user input
 */

export interface CommunityPostInsert {
  post_id: PostModel['id'];
  community_id: CommunityModel['id'];
}

export interface CommunityPostInsertAuto {
  id: uuid;
}

export type CommunityPostModel = CommunityPostInsert & CommunityPostInsertAuto;
