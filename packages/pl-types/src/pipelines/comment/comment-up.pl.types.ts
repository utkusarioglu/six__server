import type { isoDate, uint, uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { CommentSave } from 'six__server__ep-types';

export type CommentUpPl = {
  _router: DataNode<CommentSave['_post']['_req']['Body']>;

  _accessor: DataNode<CommentUpPl['_router']['OutT']>;

  _insert: DataNode<
    CommentUpPl['_accessor']['OutT'],
    {},
    'userId' | 'postId',
    {
      parentId: 'parent_id';
      userId: 'user_id';
      postId: 'post_id';
    }
  >;

  _db: DataNode<
    CommentUpPl['_insert']['OutT'],
    {
      id: uuid;
      created_at: isoDate;
      like_count: uint;
      dislike_count: uint;
    }
  >;
};
