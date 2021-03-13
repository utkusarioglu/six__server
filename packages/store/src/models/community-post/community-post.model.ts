import type {
  CommunityPostUpPl,
  CommunityPostInsertPrepareIn,
  CommunityPostInsertPrepareOut,
} from './community-post.model.types';
import type { Transaction } from 'knex';
import type { uuid } from '../../@types/helpers.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class CommunityPostStore extends Model<CommunityPostUpPl> {
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
      table.uuid('post_id');
      table.uuid('community_id');

      table
        .foreign('post_id')
        .references('posts.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('community_id')
        .references('communities.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  async insert(
    input: CommunityPostInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<{ id: uuid }[] | void> {
    const prepare = ({
      postId,
      communityId,
    }: CommunityPostInsertPrepareIn): CommunityPostInsertPrepareOut => ({
      post_id: postId,
      community_id: communityId,
    });

    return this._insert(input, prepare, ['id'], transaction, rollback);
  }
}

export default new CommunityPostStore({
  singular: 'community_post',
  plural: 'community_posts',
  connector: postgres,
});
