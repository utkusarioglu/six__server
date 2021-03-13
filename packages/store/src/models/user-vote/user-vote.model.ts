import type {
  UserVoteUpPl,
  UserVoteInsertPrepareIn,
  UserVoteInsertPrepareOut,
} from './user-vote.model.types';
import type { Transaction } from 'knex';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class UserVoteStore extends Model<UserVoteUpPl> {
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

  async insert(
    input: UserVoteInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ) {
    const prepare = ({
      userId,
      voteId,
    }: UserVoteInsertPrepareIn): UserVoteInsertPrepareOut => ({
      user_id: userId,
      vote_id: voteId,
    });

    return this._insert(input, prepare, ['id'], transaction, rollback);
  }
}

export default new UserVoteStore({
  singular: 'user_vote',
  plural: 'user_votes',
  connector: postgres,
});
