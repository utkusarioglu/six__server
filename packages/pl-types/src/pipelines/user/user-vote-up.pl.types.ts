import type { DataNode } from '../../helpers/data-node.types';
import type { PostVoteUpPl } from '../post/post-vote-up.pl.types';
import type { CommentVoteUpPl } from '../comment/comment-vote-up.pl.types';
import type { uuid } from '../../helpers/alias.types';
import type { VoteUpPl } from '../vote/vote-up.pl.types';

export type UserVoteUpPl = {
  _accessor: DataNode<
    Pick<
      PostVoteUpPl['_accessor']['In'] | CommentVoteUpPl['_accessor']['In'],
      'userId'
    > & {
      voteId: VoteUpPl['_db']['OutT']['id'];
    }
  >;

  _insert: DataNode<
    UserVoteUpPl['_accessor']['OutT'],
    {},
    never,
    {
      userId: 'user_id';
      voteId: 'vote_id';
    }
  >;

  _db: DataNode<
    UserVoteUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
