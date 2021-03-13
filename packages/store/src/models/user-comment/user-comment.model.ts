import type {
  UserCommentUpPl,
  UserCommentInsertPrepareIn,
  UserCommentInsertPrepareOut,
} from './user-comment.model.types';
import type { Transaction } from 'knex';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class UserCommentStore extends Model<UserCommentUpPl> {
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
      t.uuid('comment_id');

      t.foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      t.foreign('comment_id')
        .references('comments.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  async insert(
    input: UserCommentInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<UserCommentInsertPrepareOut | void> {
    const prepare = ({
      userId,
      commentId,
    }: UserCommentInsertPrepareIn): UserCommentInsertPrepareOut => ({
      user_id: userId,
      comment_id: commentId,
    });

    return this._insert(input, prepare, ['id'], transaction, rollback);
  }
}

export default new UserCommentStore({
  singular: 'user_comment',
  plural: 'user_comments',
  connector: postgres,
});
