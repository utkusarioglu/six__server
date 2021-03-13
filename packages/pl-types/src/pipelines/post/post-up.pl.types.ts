import type { isoDate, uint, uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { PostCreateIn } from 'six__server__ep-types';

export type PostUpPl = {
  _router: DataNode<PostCreateIn>;

  _accessor: DataNode<
    PostUpPl['_router']['OutT'],
    {},
    'userId' | 'communityId' | 'mediaImagePath'
  >;

  _insert: DataNode<
    PostUpPl['_accessor']['OutT'],
    {
      slug: string;
    },
    never,
    {
      userId: 'user_id';
      communityId: 'community_id';
    }
  >;

  _db: DataNode<
    PostUpPl['_insert']['OutT'],
    {
      id: uuid;
      created_at: isoDate;
      like_count: uint;
      dislike_count: uint;
      comment_count: uint;
    }
  >;
};
