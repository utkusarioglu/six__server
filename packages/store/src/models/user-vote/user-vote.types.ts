/**
 * Defines the properties that need to be supplied by the user to insert
 * UserVote entry to user_votes
 */

export interface UserVoteInsert {
  user_id: string;
  vote_id: string;
}
