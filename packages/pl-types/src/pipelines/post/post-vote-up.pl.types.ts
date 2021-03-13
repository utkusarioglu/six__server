import type { uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { VoteUpPl } from '../vote/vote-up.pl.types';
import type { PostVoteIn } from 'six__server__ep-types';

export type PostVoteUpPl = {
  _router: DataNode<PostVoteIn>;

  _accessor: DataNode<
    PostVoteUpPl['_router']['OutT'],
    {
      // comes from vote insert
      voteId: VoteUpPl['_db']['OutT']['id'];
    }
  >;

  _insert: DataNode<
    PostVoteUpPl['_accessor']['OutT'],
    {},
    'voteType' | 'userId',
    {
      postId: 'post_id';
      voteId: 'vote_id';
    }
  >;

  _db: DataNode<
    PostVoteUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
