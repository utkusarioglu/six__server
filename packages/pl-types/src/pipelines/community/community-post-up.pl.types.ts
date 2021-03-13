import type { uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { PostCreateIn } from 'six__server__ep-types';
import type { PostUpPl } from '../post/post-up.pl.types';

/**
 * CommunityPost is an associative schema that establishes the connection
 * between a community and a post. Receives its data from post creation
 * input and the post id returned from the creation of the said post
 */
export type CommunityPostUpPl = {
  _accessor: DataNode<
    Pick<PostCreateIn, 'communityId'>,
    {
      postId: PostUpPl['_db']['OutT']['id'];
    }
  >;

  _insert: DataNode<
    CommunityPostUpPl['_accessor']['OutT'],
    {},
    never,
    {
      postId: 'post_id';
      communityId: 'community_id';
    }
  >;

  _db: DataNode<
    CommunityPostUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
