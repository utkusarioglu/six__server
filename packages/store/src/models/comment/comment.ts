import { uuid } from '../../@types/helpers';
import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import { CommentInsert, CommentModel } from './comment.types';

export class CommentStore extends Model<CommentInsert, CommentModel> {
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
      table.integer('like_count').defaultTo(1);
      table.integer('dislike_count').defaultTo(0);
    });
  }

  async insert(commentInsert: CommentInsert) {
    const { post_id, parent_id, body, user_id } = commentInsert;
    const comment = { parent_id, body };
    let comment_id: uuid; // this will be created by the db

    return this._getConnector().transaction(async (associations) => {
      const rollbackAssociations = (err: string) => {
        associations.rollback();
        this._errorHandler(err);
      };

      await postgres.transaction(async (entities) => {
        /** Error handler and rollback for entities */
        const rollbackEntities = (err: string) => {
          entities.rollback();
          this._errorHandler(err);
        };

        // save the comment
        await postgres('comments')
          .transacting(entities)
          .insert(comment, ['id'])
          .then((returns) => (comment_id = returns[0].id))
          .catch(rollbackEntities);

        // increment the comment count for the post by 1
        await postgres('posts')
          .transacting(entities)
          .increment('comment_count', 1)
          .where({ post_id })
          .catch(rollbackEntities);
      });

      // associate the new comment with a user
      await postgres('user_comments')
        .transacting(associations)
        .insert({
          user_id,
          comment_id,
        })
        .catch(rollbackAssociations);

      // associate the new comment with a post
      await postgres('post_comments')
        .transacting(associations)
        .insert({
          post_id,
          comment_id,
        })
        .catch(rollbackAssociations);
    });
  }

  // !shouldn't be post slug, this is connected data
  async selectByPostSlug(postSlug: string) {
    return Promise.resolve([
      {
        id: 'id',
        parentId: null,
        createdAt: 'some time',
        body: 'this is the text of the comment',
        likeCount: 1,
        dislikeCount: 1,
      },
    ]);
  }
}

export default new CommentStore({
  singular: 'comment',
  plural: 'comments',
  connector: postgres,
});
