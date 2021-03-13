import type {
  PostVoteUpPl,
  PostVoteInsertPrepareIn,
  PostVoteInsertPrepareOut,
} from './post-vote.model.types';
import type { Transaction } from 'knex';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class PostVoteStore extends Model<PostVoteUpPl> {
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
      table.uuid('vote_id');

      table
        .foreign('post_id')
        .references('posts.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('vote_id')
        .references('votes.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  /**
   * Inserts input values after they go through preparation
   *
   * @remarks
   * This method demands a transaction to execute
   *
   * @param input input to be prepared and eventually inserted
   * @param transaction knex transaction object
   * @param rollback rollback function in case the transaction fails
   */
  async insert(
    input: PostVoteInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<PostVoteInsertPrepareOut[] | void> {
    const prepare = ({
      postId,
      voteId,
    }: PostVoteInsertPrepareIn): PostVoteInsertPrepareOut => ({
      post_id: postId,
      vote_id: voteId,
    });

    return this._insert(input, prepare, ['id'], transaction, rollback);
  }
}

export default new PostVoteStore({
  singular: 'post_vote',
  plural: 'post_votes',
  connector: postgres,
});
