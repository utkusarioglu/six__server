import type { uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { CommentSaveIn } from 'six__server__ep-types';
import type { CommentUpPl } from '../comment/comment-up.pl.types';

export type UserCommentUpPl = {
  _accessor: DataNode<
    Pick<CommentSaveIn, 'userId'>,
    {
      commentId: CommentUpPl['_db']['OutT']['id'];
    }
  >;

  _insert: DataNode<
    UserCommentUpPl['_accessor']['OutT'],
    {},
    never,
    {
      userId: 'user_id';
      commentId: 'comment_id';
    }
  >;

  _db: DataNode<
    UserCommentUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
