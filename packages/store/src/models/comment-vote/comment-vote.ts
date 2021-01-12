import postgres from '../../connectors/postgres';
import { CommentVoteInsert } from './comment-vote.types';
import { Model } from '../model/model';

export class CommentVoteStore extends Model<CommentVoteInsert> {
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
      table.uuid('vote_id');
      table.uuid('comment_id');

      table
        .foreign('vote_id')
        .references('votes.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('comment_id')
        .references('comments.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }
}

export default new CommentVoteStore({
  singular: 'comment_vote',
  plural: 'comment_votes',
  connector: postgres,
});
