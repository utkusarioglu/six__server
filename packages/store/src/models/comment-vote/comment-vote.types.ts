import { uuid } from '../../@types/helpers';
import type { CommentModel } from '../comment/comment.types';
import type { VoteModel } from '../vote/vote.types';

/**
 * Defines the properties of a Comment Like that needs to be input
 * by the user
 */

export interface CommentVoteInsert {
  /** Id of the user that sends the like command */
  vote_id: VoteModel['id'];
  /** Id of the comment on which the like is make */
  comment_id: CommentModel['id'];
}

export interface CommentVoteInsertAuto {
  id: uuid;
}

export type CommentVoteModel = CommentVoteInsert & CommentVoteInsertAuto;
