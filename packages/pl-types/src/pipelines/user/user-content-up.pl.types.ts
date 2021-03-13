import type { mimetype, uuid } from '../../helpers/alias.types';
import type { DataNode } from '../../helpers/data-node.types';
import type { PostCreateIn } from 'six__server__ep-types';

export type UserContentUpPl = {
  /**
   * Right now, the only source of user content is post creation.
   * however in the future, when communities and user avatars become
   * available, this pipeline may need a complete overhaul
   */
  _accessor: DataNode<
    Pick<PostCreateIn, 'mediaImagePath'>,
    {
      type: mimetype;
    },
    never,
    {
      mediaImagePath: 'filename';
    }
  >;

  _insert: DataNode<UserContentUpPl['_accessor']['OutT']>;

  _db: DataNode<
    UserContentUpPl['_insert']['OutT'],
    {
      id: uuid;
    }
  >;
};
