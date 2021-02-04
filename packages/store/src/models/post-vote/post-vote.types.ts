import type { PostGetRes } from 'six__public-api';
import { uuid } from '../../@types/helpers';
import type { VoteModel } from '../vote/vote.types';

export interface PostVoteInsert {
  /** The post_id of the post to which the like is granted */
  post_id: PostGetRes['res']['id'];
  /** The user_id of the user whom likes the post */
  vote_id: VoteModel['id'];
}

export interface PostVoteInsertAuto {
  id: uuid;
}

export type PostVoteModel = PostVoteInsert & PostVoteInsertAuto;
