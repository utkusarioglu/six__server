import type { UserGetRes } from 'six__public-api';
import { uuid } from '../../@types/helpers';
import type { PostModel } from '../post/post.types';

/**
 * Defines the properties that need to be supplied by the user to insert
 * UserPost entry
 */
export interface UserPostInsert {
  user_id: UserGetRes['res']['id'];
  post_id: PostModel['id'];
}

export interface UserPostSqlAutoInsert {
  id: uuid;
}

export type UserPostModel = UserPostInsert & UserPostSqlAutoInsert;
