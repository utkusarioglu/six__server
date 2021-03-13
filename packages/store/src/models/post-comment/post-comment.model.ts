import type {
  PostCommentUpPl,
  PostCommentInsertPrepareIn,
  PostCommentInsertPrepareOut,
} from './post-comment.model.types';
import type { Transaction } from 'knex';
import type { uuid } from '../../@types/helpers.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class PostCommentStore extends Model<PostCommentUpPl> {
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
      table.uuid('comment_id');

      table
        .foreign('post_id')
        .references('posts.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .foreign('comment_id')
        .references('comments.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  async insert(
    input: PostCommentInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<{ id: uuid }[] | void> {
    const prepare = ({
      postId,
      commentId,
    }: PostCommentInsertPrepareIn): PostCommentInsertPrepareOut => ({
      post_id: postId,
      comment_id: commentId,
    });

    return this._insert(input, prepare, ['id'], transaction, rollback);
  }
}

export default new PostCommentStore({
  singular: 'post_comment',
  plural: 'post_comments',
  connector: postgres,
});
