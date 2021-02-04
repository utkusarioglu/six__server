import type {
  PostVotePostReq,
  VoteSqlAutoSave,
  CommentVotePostReq,
} from 'six__public-api';

/**
 * Defines the properties that need to be supplied by the user to insert a
 * vote to votes
 */

export interface VoteInsert {
  vote_type:
    | PostVotePostReq['req']['voteType']
    | CommentVotePostReq['req']['voteType'];
}

export interface VoteInsertAuto {
  id: VoteSqlAutoSave['id'];
  created_at: VoteSqlAutoSave['createdAt'];
}

export type VoteModel = VoteInsert & VoteInsertAuto;
