import type { uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { UserUcsAlterIn } from 'six__server__ep-types';

export type UserCommunitySubscriptionUpPl = {
  _router: DataNode<UserUcsAlterIn>;

  _accessor: DataNode<
    UserCommunitySubscriptionUpPl['_router']['OutT'],
    {},
    'actionType'
  >;

  _insert: DataNode<
    UserCommunitySubscriptionUpPl['_accessor']['OutT'],
    {},
    never,
    {
      userId: 'user_id';
      communityId: 'community_id';
    }
  >;

  _db: DataNode<
    UserCommunitySubscriptionUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
