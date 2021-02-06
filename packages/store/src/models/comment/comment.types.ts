import type {
  CommentSqlAutoSave,
  CommentSavePostReq,
  CommentsGetRes,
} from 'six__public-api';

/**
 * Defines the properties of comment that needs to come from
 * user input
 */
export interface CommentInsert {
  post_id: CommentSavePostReq['req']['postId'];
  user_id: CommentSavePostReq['req']['userId'];
  parent_id: CommentSavePostReq['req']['parentId'];
  body: CommentSavePostReq['req']['body'];
}

/**
 * Values of comment model that are filled by the database
 */
export interface CommentInsertAuto {
  id: CommentSqlAutoSave['id']; // uuid
  created_at: CommentSqlAutoSave['createdAt']; // iso date
  like_count: CommentSqlAutoSave['likeCount']; // uint
  dislike_count: CommentSqlAutoSave['dislikeCount']; // uint
}

/**
 * Shape of comment table rows
 */
export type CommentModel = CommentInsertAuto & CommentInsert;

/**
 * Shape of return when Comments for a particular post is being returned
 */
export type CommentsForPostSlug = CommentsGetRes['res'];
