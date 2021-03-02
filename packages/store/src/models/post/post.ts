import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import _ from 'lodash';
import {
  PostPipeline,
  PostSlug,
  PostInput,
  PostPrepareInsert,
  PostColumns,
} from './post.types';
import store from 'six__server__store';

export class PostStore extends Model<PostPipeline> {
  /**
   * Columns used in selecting for building the posts wall for users and
   * visitors
   *
   * @privateRemarks
   * The column names returned should be consistent with
   * public-api.PostsResponse
   */
  private _post_columns: PostColumns = {
    id: 'posts.id',
    createdAt: 'posts.created_at',
    postTitle: 'posts.title',
    postBody: 'posts.body',
    postSlug: 'posts.slug',
    likeCount: 'posts.like_count',
    dislikeCount: 'posts.dislike_count',
    commentCount: 'posts.comment_count',
    creatorUsername: 'u.username',
    communityName: 'c.name',
    communitySlug: 'c.slug',
    mediaImagePath: 'uc.filename',
    mediaType: 'uc.type',
  };

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
      table.string('title').notNullable();
      table.text('body', ['longtext']).notNullable();
      table.string('slug').notNullable();
      table.integer('dislike_count').defaultTo(0);
      /**
       * Defaults to 1 because every post starts with the like
       * from its creator. But this implementation means that the like is not
       * saved in post_likes table. This line should be reviewed later
       */
      table.integer('like_count').defaultTo(1);
      table.integer('comment_count').defaultTo(0);
    });
  }

  async selectUserPosts(user_id: string) {
    return this._queryBuilder((table) => {
      return table
        .join({ cp: 'community_posts' }, 'cp.post_id', 'posts.id')
        .join({ c: 'communities' }, 'c.id', 'cp.community_id')
        .join(
          { ucs: 'user_community_subscriptions' },
          'ucs.community_id',
          'c.id'
        )
        .join({ u: 'users' }, 'u.id', 'ucs.user_id')
        .leftJoin({ puc: 'post_user_contents' }, 'posts.id', 'puc.post_id')
        .leftJoin({ uc: 'user_contents' }, 'puc.user_content_id', 'uc.id')
        .select(this._post_columns)
        .where({ 'u.id': user_id });
    });
  }

  /**
   * Selects the posts that the visitors see
   */
  async selectVisitorPosts() {
    return this._queryBuilder((table) => {
      return table
        .join({ up: 'user_posts' }, 'posts.id', 'up.post_id')
        .join({ u: 'users' }, 'u.id', 'up.user_id')
        .join({ cp: 'community_posts' }, 'cp.post_id', 'posts.id')
        .join({ c: 'communities' }, 'c.id', 'cp.community_id')
        .join(
          { vcs: 'visitor_community_subscriptions' },
          'vcs.community_id',
          'c.id'
        )
        .leftJoin({ puc: 'post_user_contents' }, 'posts.id', 'puc.post_id')
        .leftJoin({ uc: 'user_contents' }, 'puc.user_content_id', 'uc.id')
        .select(this._post_columns);
    });
  }

  /**
   * Selects a single post from the database by its slug
   *
   * @param postSlug slug for the post to be returned
   */
  async selectPostBySlug(postSlug: PostSlug) {
    return this._queryBuilder((table) => {
      return table
        .select(this._post_columns)
        .join({ up: 'user_posts' }, 'posts.id', 'up.post_id')
        .join({ u: 'users' }, 'u.id', 'up.user_id')
        .join({ cp: 'community_posts' }, 'cp.post_id', 'posts.id')
        .join({ c: 'communities' }, 'c.id', 'cp.community_id')
        .leftJoin({ puc: 'post_user_contents' }, 'posts.id', 'puc.post_id')
        .leftJoin({ uc: 'user_contents' }, 'puc.user_content_id', 'uc.id')
        .where({ 'posts.slug': postSlug });
    });
  }

  /**
   * Includes the auto-created values for the post insertion
   *
   * @param postInput post insert values from user input
   */
  private prepareInsert({
    title,
    body,
    userId,
    communityId,
    mediaImagePath,
  }: PostInput): PostPrepareInsert {
    return {
      insert: {
        title,
        body,
        slug: _.kebabCase(title),
      },
      foreign: {
        user_id: userId,
        community_id: communityId,
        cover_image_path: mediaImagePath,
        type: mediaImagePath !== '' ? 'image/jpeg' : '',
      },
    };
  }

  /**
   * @override
   * Inserts into posts, votes along with the post's related user, community,
   * vote associations
   *
   * @param postInput defined by {@link PostInsert}, contains post data as well
   * as community_id and user_id
   *
   * @privateRemarks
   * This method cannot use the typical pattern of using the query builder as
   * it contains transactions. If the {@link Model} class ever receives
   * a method for managing transactions, this method will have to be written
   * again
   */
  async insert(postInput: PostInput) {
    const {
      insert: post,
      foreign: { community_id, cover_image_path, user_id, type },
    } = this.prepareInsert(postInput);

    /** these will be created as the transactions run */
    let post_id: string; // uuid
    let vote_id: string; // uuid
    let user_content_id: string; // uuid

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

            if (cover_image_path) {
              await postgres('user_contents')
                .transacting(entities)
                .insert(
                  {
                    filename: cover_image_path,
                    type,
                  },
                  ['id']
                )
                .then((returns) => (user_content_id = returns[0].id))
                .catch(rollbackEntities);
            }
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
          if (user_content_id) {
            await postgres('post_user_contents')
              .transacting(associations)
              .insert({
                post_id,
                user_content_id,
              })
              .catch(rollbackAssociations);
          }
        })
    );
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
  async insert3(postInsert: PostInput) {
    const {
      insert: post,
      foreign: { community_id, cover_image_path, user_id, type },
    } = this.prepareInsert(postInsert);

    /** these will be created as the transactions run */
    let post_id: string; // uuid
    let vote_id: string; // uuid
    let user_content_id: string; // uuid

    return (
      this._getConnector()
        /** Transaction for handling associations and entities */
        .transaction(async (transaction) => {
          const post_id = await this._insert(post, ['id'], transaction).then(
            (row) => row && row[0].id
          );

          console.log('post_id', post_id);

          const vote = await store.vote.insert(
            { voteType: 1 },
            ['id'],
            transaction
          );

          console.log('vote', vote);
        })
    );
  }
}

export default new PostStore({
  singular: 'post',
  plural: 'posts',
  connector: postgres,
});
