import type { uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';

/**
 * Visitor community subscriptions have no surface area for the client.
 */
export type VisitorCommunitySubscriptionUpPl = {
  _accessor: DataNode<{
    communityId: uuid;
  }>;

  _insert: DataNode<
    VisitorCommunitySubscriptionUpPl['_accessor']['OutT'],
    {},
    never,
    {
      communityId: 'community_id';
    }
  >;

  _db: DataNode<
    VisitorCommunitySubscriptionUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
