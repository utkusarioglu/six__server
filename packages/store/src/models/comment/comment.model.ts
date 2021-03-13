import type {
  CommentUpPl,
  CommentForPostIdColumns,
  CommentInsertPrepareIn,
  CommentInsertPrepareOut,
} from './comment.model.types';
import type { Transaction } from 'knex';
import type { uuid } from '../../@types/helpers.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class CommentStore extends Model<CommentUpPl> {
  /**
   * Creates the respective table in the connected database.
   * Creation only happens if a table with the name {@link this.plural}
   * does not exist. This check does not take into account the structure
   * of the preexisting table
   *
   * @privateRemarks
   * Please be familiar with the workings of {@link Model._createTable}
   * Before using this method.
   */
  async createTable() {
    return this._createTable((table) => {
      table.uuid('id').primary().defaultTo(this._raw('uuid_generate_v4()'));
      table.timestamp('created_at').defaultTo(this._now());
      table.string('body');
      table.uuid('parent_id').defaultTo(null);
      /**
       * Every comment starts with 1 like from the person who submits the
       * comment. For this reason, like count defaults to 1. However this behavior
       * implies that the first like of every comment is assumed instead of
       * recorded. In case this is deemed unacceptable, this default will need to
       * be altered
       */
      table.integer('like_count').defaultTo(0);
      table.integer('dislike_count').defaultTo(0);
    });
  }

  async insert(
    input: CommentInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<{ id: uuid }[] | void> {
    const prepare = ({
      parentId,
      body,
    }: CommentInsertPrepareIn): CommentInsertPrepareOut => ({
      parent_id: parentId,
      body,
    });

    return this._insert(input, prepare, ['id'], transaction, rollback);
  }

  async selectByPostId(postId: uuid) {
    const columns: CommentForPostIdColumns = {
      id: 'comments.id',
      parentId: 'comments.parent_id',
      createdAt: 'comments.created_at',
      body: 'comments.body',
      likeCount: 'comments.like_count',
      dislikeCount: 'comments.dislike_count',
      postSlug: 'p.slug',
      postId: 'p.id',
      userId: 'u.id',
      creatorUsername: 'u.username',
      state: this._raw("'submitted'"),
    };

    return this._queryBuilder((table) => {
      return table
        .select(columns)
        .join({ pc: 'post_comments' }, 'comments.id', 'pc.comment_id')
        .join({ p: 'posts' }, 'p.id', 'pc.post_id')
        .join({ uc: 'user_comments' }, 'uc.comment_id', 'comments.id')
        .join({ u: 'users' }, 'u.id', 'uc.user_id')
        .where({ 'pc.post_id': postId });
    });
  }
}

export default new CommentStore({
  singular: 'comment',
  plural: 'comments',
  connector: postgres,
});
