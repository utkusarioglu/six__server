import type { UserGetRes } from 'six__public-api';
import { uuid } from '../../@types/helpers';
import type { CommentModel } from '../comment/comment.types';

/**
 * Defines the properties that need to be supplied by the user for
 * a user comment to be inserted
 */

export interface UserCommentInsert {
  user_id: UserGetRes['res']['id'];
  comment_id: CommentModel['id'];
}

export interface UserCommentSqlAutoInsert {
  id: uuid;
}

export type UserCommentModel = UserCommentInsert & UserCommentSqlAutoInsert;
