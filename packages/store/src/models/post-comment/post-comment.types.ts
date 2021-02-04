import type { PostGetRes } from 'six__public-api';
import { uuid } from '../../@types/helpers';
import type { CommentModel } from '../comment/comment.types';

/**
 * Defines properties that need to come from user input for creating a
 * PostComment entry
 */

export interface PostCommentInsert {
  post_id: PostGetRes['res']['id'];
  comment_id: CommentModel['id'];
}

export interface PostCommentSqlAutoInsert {
  id: uuid;
}

export type PostCommentModel = PostCommentInsert & PostCommentSqlAutoInsert;
