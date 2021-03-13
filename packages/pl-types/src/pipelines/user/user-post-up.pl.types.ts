import type { uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { PostCreateIn } from 'six__server__ep-types';
import type { PostUpPl } from '../post/post-up.pl.types';

export type UserPostUpPl = {
  _accessor: DataNode<
    Pick<PostCreateIn, 'userId'>,
    {
      postId: PostUpPl['_db']['OutT']['id'];
    }
  >;

  _insert: DataNode<
    UserPostUpPl['_accessor']['OutT'],
    {},
    never,
    {
      userId: 'user_id';
      postId: 'post_id';
    }
  >;

  _db: DataNode<
    UserPostUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
