import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import { CommentInsert } from './comment.types';

export class CommentStore extends Model<CommentInsert> {
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
      table.uuid('id').primary().defaultTo(postgres.raw('uuid_generate_v4()'));
      table.uuid('parent_id').defaultTo(null);
      table.timestamp('created_at').defaultTo(postgres.fn.now());
      table.string('body');
      /**
       * Every comment starts with 1 like from the person who submits the
       * comment. For this reason, like count defaults to 1. However this behavior
       * implies that the first like of every comment is assumed instead of
       * recorded. In case this is deemed unacceptable, this default will need to
       * be altered
       */
      table.integer('like_count').defaultTo(1);
      table.integer('dislike_count').defaultTo(0);
    });
  }
}

export default new CommentStore({
  singular: 'comment',
  plural: 'comments',
  connector: postgres,
});
