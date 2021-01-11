import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import { UserVoteInsert } from './user-vote.types';

export class UserVoteStore extends Model<UserVoteInsert> {
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
      t.uuid('user_id');
      t.uuid('vote_id');

      t.foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      t.foreign('vote_id')
        .references('votes.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }
}

export default new UserVoteStore({
  singular: 'user_vote',
  plural: 'user_votes',
  connector: postgres,
});
