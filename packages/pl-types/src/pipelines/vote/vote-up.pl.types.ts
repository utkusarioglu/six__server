import type { isoDate, uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { CommentVoteUpPl } from '../comment/comment-vote-up.pl.types';
import type { PostVoteUpPl } from '../post/post-vote-up.pl.types';

export type VoteUpPl = {
  _accessor: DataNode<
    Pick<
      PostVoteUpPl['_accessor']['In'] | CommentVoteUpPl['_accessor']['In'],
      'voteType'
    >
  >;

  _insert: DataNode<
    VoteUpPl['_accessor']['OutT'],
    {},
    never,
    {
      voteType: 'vote_type';
    }
  >;

  _db: DataNode<
    VoteUpPl['_insert']['OutT'],
    {
      id: uuid;
      created_at: isoDate;
    }
  >;
};
