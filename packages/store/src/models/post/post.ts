import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import _ from 'lodash';
import { PostInsert } from './post.types';

export class PostStore extends Model<PostInsert> {
  /**
   * Columns used in selecting for building the posts wall for users and
   * visitors
   */
  private _post_columns = [
    'posts.id',
    'posts.created_at',
    'title',
    'body',
    postgres.raw('like_count - dislike_count AS vote_count'),
    'comment_count',
    'unique_commenter_count',
    'name AS community_name',
  ];

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
      table.timestamp('created_at').defaultTo(postgres.fn.now());
      table.string('title');
      table.string('body');
      table.integer('dislike_count').defaultTo(0);
      /**
       * Defaults to 1 because every post starts with the like
       * from its creator. But this implementation means that the like is not
       * saved in post_likes table. This line should be reviewed later
       */
      table.integer('like_count').defaultTo(1);
      table.integer('comment_count').defaultTo(0);
      table.string('unique_commenter_count').defaultTo(0);
    });
  }

  async selectUserPosts(user_id: string) {
    return this._queryBuilder((table) => {
      return table
        .join('community_posts AS cp', 'cp.post_id', 'posts.id')
        .join('communities AS c', 'c.id', 'cp.community_id')
        .join('user_community_subscriptions AS ucs', 'ucs.community_id', 'c.id')
        .select(this._post_columns)
        .where({ user_id });
    });
  }

  /**
   * Selects the posts that the visitors see
   *
   * @remarks
   *
   */
  async selectVisitorPosts() {
    return this._queryBuilder((table) => {
      return table
        .join('community_posts AS cp', 'cp.post_id', 'posts.id')
        .join('communities AS c', 'c.id', 'cp.community_id')
        .join(
          'visitor_community_subscriptions AS vc',
          'vc.community_id',
          'c.id'
        )
        .select(this._post_columns);
    });
  }

  /**
   * @override
   * Inserts into posts, votes along with the post's related user, community,
   * vote associations
   *
   * @param postInsert defined by {@link PostInsert}, contains post data as well
   * as community_id and user_id
   *
   * @privateRemarks
   * This method cannot use the typical pattern of using the query builder as
   * it contains transactions. If the {@link Model} class ever receives
   * a method for managing transactions, this method will have to be written
   * again
   */
  async insert(postInsert: PostInsert) {
    const { community_id, user_id } = postInsert;
    const post = _.pick(postInsert, 'title', 'body');

    /** these will be created as the transactions run */
    let post_id: any;
    let vote_id: any;

    return (
      this._getConnector()
        /** Transaction for handling associations and entities */
        .transaction(async (associations) => {
          /** Error handler and rollback for associations*/
          const rollbackAssociations = (err: string) => {
            associations.rollback();
            this._errorHandler(err);
          };

          /** Transaction for handling entities */
          await postgres.transaction(async (entities) => {
            /** Error handler and rollback for entities */
            const rollbackEntities = (err: string) => {
              entities.rollback();
              this._errorHandler(err);
            };

            await postgres('posts')
              .transacting(entities)
              .insert(post, ['id'])
              .then((returns) => (post_id = returns[0].id))
              .catch(rollbackEntities);

            await postgres('votes')
              .transacting(entities)
              .insert(
                {
                  vote_type: 1,
                },
                ['id']
              )
              .then((returns) => (vote_id = returns[0].id))
              .catch(rollbackEntities);
          });

          await postgres('user_posts')
            .transacting(associations)
            .insert({
              user_id,
              post_id,
            })
            .catch(rollbackAssociations);

          await postgres('user_votes')
            .transacting(associations)
            .insert({
              user_id,
              vote_id,
            })
            .catch(rollbackAssociations);

          await postgres('post_votes')
            .transacting(associations)
            .insert({
              post_id,
              vote_id,
            })
            .catch(rollbackAssociations);

          await postgres('community_posts')
            .transacting(associations)
            .insert({
              community_id,
              post_id,
            })
            .catch(rollbackAssociations);
        })
    );
  }
}

export default new PostStore({
  singular: 'post',
  plural: 'posts',
  connector: postgres,
});
