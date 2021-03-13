import type {
  PostUserContentUpPl,
  PostUserContentInsertPrepareIn,
  PostUserContentInsertPrepareOut,
} from './post-user-content.model.types';
import type { Transaction } from 'knex';
import type { uuid } from '../../@types/helpers.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

/**
 * Association table for connecting posts with user content (uploaded files)
 */
export class PostUserContentStore extends Model<PostUserContentUpPl> {
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
    return this._createTable((table) => {
      table.uuid('id').primary().defaultTo(this._raw('uuid_generate_v4()'));
      table.uuid('post_id').notNullable();
      table.uuid('user_content_id').notNullable();

      table
        .foreign('post_id')
        .references('posts.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('user_content_id')
        .references('user_contents.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  async insert(
    input: PostUserContentInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<{ id: uuid }[] | void> {
    const prepare = ({
      postId,
      userContentId,
    }: PostUserContentInsertPrepareIn): PostUserContentInsertPrepareOut => ({
      post_id: postId,
      user_content_id: userContentId,
    });

    return this._insert(input, prepare, ['id'], transaction, rollback);
  }
}

export default new PostUserContentStore({
  singular: 'post_user_content',
  plural: 'post_user_contents',
  connector: postgres,
});
