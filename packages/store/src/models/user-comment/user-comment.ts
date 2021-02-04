import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import { UserCommentInsert, UserCommentModel } from './user-comment.types';

export class UserCommentStore extends Model<
  UserCommentInsert,
  UserCommentModel
> {
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
}

export default new UserCommentStore({
  singular: 'user_comment',
  plural: 'user_comments',
  connector: postgres,
});
