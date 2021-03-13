import type {
  VoteUpPl,
  VoteInsertPrepareIn,
  VoteInsertPrepareOut,
  SelectPostVotesColumns,
  SelectPostVotesOut,
} from './vote.model.types';
import type { Transaction } from 'knex';
import type { VoteTypes } from 'six__server__ep-types';
import type { uuid } from '../../@types/helpers.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class VoteStore extends Model<VoteUpPl> {
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
      t.integer('vote_type').defaultTo(0);
      t.timestamp('created_at').defaultTo(this._now());
    });
  }

  /**
   * Inserts into votes table
   * @param input input properties for insertion
   * @param transaction Knex transaction object
   * @param rollback rollback function to execute if needed in a transaction
   * @returns vote_type property of the inserted rows
   */
  async insert(
    input: VoteInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<{ id: string }[] | void> {
    const prepareInsert = ({
      voteType,
    }: VoteInsertPrepareIn): VoteInsertPrepareOut => ({
      vote_type: voteType,
    });

    return this._insert(input, prepareInsert, ['id'], transaction, rollback);
  }

  async deleteById(voteId: uuid, transaction: Transaction) {
    console.log('deleting voteid: ', voteId);
    return this._getTable()
      .transacting(transaction)
      .delete()
      .where('id', voteId)
      .catch(this._errorHandler);
  }

  async selectPostVotesForUserId(
    postId: uuid,
    userId: uuid
  ): Promise<SelectPostVotesOut | void> {
    const columns: SelectPostVotesColumns = {
      voteId: 'votes.id',
      voteType: 'votes.vote_type',
    };

    return this._getTable()
      .first(columns)
      .join({ pv: 'post_votes' }, 'pv.vote_id', 'votes.id')
      .join({ uv: 'user_votes' }, 'uv.vote_id', 'votes.id')
      .where({
        'pv.post_id': postId,
        'uv.user_id': userId,
      })
      .catch(this._errorHandler);
  }

  async updateById(id: uuid, voteType: VoteTypes) {
    return this._getTable()
      .update('vote_type', voteType)
      .where('id', id)
      .catch(this._errorHandler);
  }
}

export default new VoteStore({
  singular: 'vote',
  plural: 'votes',
  connector: postgres,
});
