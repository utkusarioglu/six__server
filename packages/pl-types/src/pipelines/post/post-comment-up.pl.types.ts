import type { uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { CommentSaveIn } from 'six__server__ep-types';
import type { CommentUpPl } from '../comment/comment-up.pl.types';

export type PostCommentUpPl = {
  _accessor: DataNode<
    Pick<CommentSaveIn, 'postId'>,
    {
      commentId: CommentUpPl['_db']['OutT']['id'];
    }
  >;

  _insert: DataNode<
    PostCommentUpPl['_accessor']['OutT'],
    {},
    never,
    {
      postId: 'post_id';
      commentId: 'comment_id';
    }
  >;

  _db: DataNode<
    PostCommentUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
