import type { isoDate, uint, uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { CommunityCreateIn } from 'six__server__ep-types';

export type CommunityUpPl = {
  _router: DataNode<CommunityCreateIn>;

  _accessor: DataNode<CommunityUpPl['_router']['OutT'], {}, 'userId'>;

  _insert: DataNode<CommunityUpPl['_accessor']['OutT']>;

  _db: DataNode<
    CommunityUpPl['_insert']['OutT'],
    {
      id: uuid;
      created_at: isoDate;
      post_count: uint;
      subscriber_count: uint;
    }
  >;
};
