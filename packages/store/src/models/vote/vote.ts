import Knex from 'knex';
import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import {
  VoteInput,
  VotePipeline,
  VotePrepareInsert,
  VoteInsertParams,
} from './vote.types';

export class VoteStore extends Model<VotePipeline> {
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
      t.integer('vote_type');
      t.timestamp('created_at').defaultTo(this._now());
    });
  }

  private prepareInsert({ voteType }: VoteInput): VotePrepareInsert {
    return {
      insert: {
        vote_type: voteType,
      },
      foreign: {},
    };
  }

  async insert(...[inserts, returns, transaction]: VoteInsertParams) {
    const { insert: vote } = this.prepareInsert(inserts);
    return this._insert(vote, returns, transaction);
  }
}

export default new VoteStore({
  singular: 'vote',
  plural: 'votes',
  connector: postgres,
});
