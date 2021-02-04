import type { VoteModel } from '../vote/vote.types';
import type { UserGetRes } from 'six__public-api';
import type { uuid } from '../../@types/helpers';

/**
 * Defines the properties that need to be supplied by the user to insert
 * UserVote entry to user_votes
 */

export interface UserVoteInsert {
  user_id: UserGetRes['res']['id'];
  vote_id: VoteModel['id'];
}

export interface UserVoteInsertAuto {
  id: uuid;
}

export type UserVoteModel = UserVoteInsert & UserVoteInsertAuto;
