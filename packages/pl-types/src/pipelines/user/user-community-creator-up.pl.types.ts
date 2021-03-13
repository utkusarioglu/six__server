import type { uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { CommunityUpPl } from '../community/community-up.pl.types';
import type { CommunityCreateIn } from 'six__server__ep-types';

export type UserCommunityCreatorUpPl = {
  _accessor: DataNode<{
    communityId: CommunityUpPl['_db']['OutT']['id'];
    userId: CommunityCreateIn['userId'];
  }>;

  _insert: DataNode<
    UserCommunityCreatorUpPl['_accessor']['OutT'],
    {},
    never,
    {
      userId: 'user_id';
      communityId: 'community_id';
    }
  >;

  _db: DataNode<
    UserCommunityCreatorUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
