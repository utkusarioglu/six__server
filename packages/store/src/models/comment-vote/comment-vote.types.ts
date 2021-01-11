/**
 * Defines the properties of a Comment Like that needs to be input
 * by the user
 */

export interface CommentVoteInsert {
  /** Id of the user that sends the like command */
  user_id: string;
  /** Id of the comment on which the like is make */
  comment_id: string;
}
