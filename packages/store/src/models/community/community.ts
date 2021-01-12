import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import { CommunityUserInsert } from './community.types';

export class CommunityStore extends Model<CommunityUserInsert> {
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
      table.timestamp('created_at').defaultTo(this._now());
      table.string('description_text');
      table.string('name');
      table.integer('post_count').defaultTo(0);
      table.integer('subscriber_count').defaultTo(1);
    });
  }
}

export default new CommunityStore({
  singular: 'community',
  plural: 'communities',
  connector: postgres,
});
