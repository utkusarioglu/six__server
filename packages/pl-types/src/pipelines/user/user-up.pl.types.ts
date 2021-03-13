import type { DataNode } from '../../helpers/data-node.types';
import type { uuid } from '../../helpers/alias.types';
import type { UserSignupIn } from 'six__server__ep-types';

export type UserUpPl = {
  _router: DataNode<UserSignupIn>;

  _accessor: DataNode<UserUpPl['_router']['OutT']>;

  _insert: DataNode<UserUpPl['_accessor']['OutT']>;

  _db: DataNode<
    UserUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
