/**
 * Defines properties that need to come from user input for creating a
 * PostComment entry
 */

export interface PostCommentInsert {
  post_id: string;
  comment_id: string;
}
