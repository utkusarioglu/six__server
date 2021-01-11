import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import { VoteInsert } from './vote.types';

export class VoteStore extends Model<VoteInsert> {
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
      t.uuid('id').primary().defaultTo(postgres.raw('uuid_generate_v4()'));
      t.integer('vote_type');
      t.timestamp('created_ad').defaultTo(postgres.fn.now());
    });
  }
}

export default new VoteStore({
  singular: 'vote',
  plural: 'votes',
  connector: postgres,
});
