import type {
  UserPostUpPl,
  UserPostInsertPrepareIn,
  UserPostInsertPrepareOut,
} from './user-post.model.types';
import type { Transaction } from 'knex';
import type { uuid } from '../../@types/helpers.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class UserPostStore extends Model<UserPostUpPl> {
  /**
   * Creates the respective table in the connected database.
   * Creation only happens if a table with the name {@link this.plural}
   * does not exist. This check does not take into account the structure
   * of the preexisting table
   *
   * @privateRemarks
   * Please be familiar with the workings of {@link Model._createTable}
   * Before using this method
   */
  async createTable() {
    return this._createTable((t) => {
      t.uuid('id').primary().defaultTo(this._raw('uuid_generate_v4()'));
      t.uuid('user_id');
      t.uuid('post_id');

      t.foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      t.foreign('post_id')
        .references('posts.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  async insert(
    input: UserPostInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<{ id: uuid }[] | void> {
    const prepare = ({
      userId,
      postId,
    }: UserPostInsertPrepareIn): UserPostInsertPrepareOut => ({
      user_id: userId,
      post_id: postId,
    });
    return this._insert(input, prepare, ['id'], transaction, rollback);
  }
}

export default new UserPostStore({
  singular: 'user_post',
  plural: 'user_posts',
  connector: postgres,
});
