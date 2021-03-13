import type { uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { CommentVoteGiveRequestIn } from 'six__server__ep-types';
import type { VoteUpPl } from '../vote/vote-up.pl.types';

export type CommentVoteUpPl = {
  _router: DataNode<CommentVoteGiveRequestIn>;

  /**
   * Accessor gets voteId from the insertion into vote schema, allowing
   * this pipeline to continue its execution
   */
  _accessor: DataNode<
    CommentVoteUpPl['_router']['OutT'],
    {
      voteId: VoteUpPl['_db']['OutT']['id'];
    }
  >;

  _insert: DataNode<
    CommentVoteUpPl['_accessor']['OutT'],
    {},
    'voteType' | 'userId',
    {
      commentId: 'comment_id';
      voteId: 'vote_id';
    }
  >;

  _db: DataNode<
    CommentVoteUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
