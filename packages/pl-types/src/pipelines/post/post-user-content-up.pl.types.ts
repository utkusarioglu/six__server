import type { uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { UserContentUpPl } from '../user/user-content-up.pl.types';
import type { PostUpPl } from '../post/post-up.pl.types';

/**
 * All the properties used in post user content are created from
 * responses from other schemas. Post Id comes from posts and
 * user content id comes from user_contents.
 */
export type PostUserContentUpPl = {
  _accessor: DataNode<{
    postId: PostUpPl['_db']['OutT']['id'];
    userContentId: UserContentUpPl['_db']['OutT']['id'];
  }>;

  _insert: DataNode<
    PostUserContentUpPl['_accessor']['OutT'],
    {},
    never,
    {
      postId: 'post_id';
      userContentId: 'user_content_id';
    }
  >;

  _db: DataNode<
    PostUserContentUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
