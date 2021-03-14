import type { PostDetailsOut, PostListOut } from 'six__server__ep-types';
import type {
  PostUpPl,
  PostSlug,
  PostInsertPrepareIn,
  PostInsertPrepareOut,
  PostColumns,
} from './post.model.types';
import type { Transaction } from 'knex';
import type { uuid } from '../../@types/helpers.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';
import _ from 'lodash';

export class PostStore extends Model<PostUpPl> {
  /**
   * Columns used in selecting for building the posts wall for users and
   * visitors
   *
   * @privateRemarks
   * The column names returned should be consistent with
   * api - PostsResponse
   */
  private _visitor_post_columns: PostColumns = {
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
    mediaImagePath: 'suc.filename',
    mediaType: 'suc.type',
    userVote: this._raw('NULL'),
  };

  private _user_post_columns: PostColumns = {
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
    mediaImagePath: 'suc.filename',
    mediaType: 'suc.type',
    userVote: this._raw(
      `
      CASE 
        WHEN vs.vote_type IS NOT NULL THEN vs.vote_type
        ELSE 0
      END
      `.replace(/\s{2,}/g, ' ')
    ),
  };

  private userContentsSubquery = this._getConnector()
    .select('post_id', 'filename', 'type')
    .from({ uc: 'user_contents' })
    .join({ puc: 'post_user_contents' }, 'puc.user_content_id', 'uc.id')
    .as('suc');

  private userVoteSubquery = (userId: uuid) =>
    this._getConnector()
      .select({ vote_type: 'v.vote_type', pv_post_id: 'pv.post_id' })
      .from({ v: 'votes' })
      .join({ pv: 'post_votes' }, 'pv.vote_id', 'v.id')
      .join({ uv: 'user_votes' }, 'uv.vote_id', 'v.id')
      .where('uv.user_id', userId)
      .as('vs');

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
      table.integer('like_count').defaultTo(0);
      table.integer('comment_count').defaultTo(0);
    });
  }

  async incrementCommentCountByPostId(
    postId: uuid,
    commentCountIncrement: number
  ) {
    return this._getTable()
      .increment('comment_count', commentCountIncrement)
      .where('id', postId)
      .catch(this._errorHandler);
  }

  async selectPostFeedPostsForLoggedIn(
    userId: string
  ): Promise<PostListOut | void> {
    return this._queryBuilder((table) => {
      const query = table
        .select(this._user_post_columns)
        .join({ cp: 'community_posts' }, 'cp.post_id', 'posts.id')
        .join({ c: 'communities' }, 'c.id', 'cp.community_id')
        .join(
          { ucs: 'user_community_subscriptions' },
          'ucs.community_id',
          'c.id'
        )
        .join({ up: 'user_posts' }, 'up.post_id', 'posts.id')
        .join({ u: 'users' }, 'u.id', 'up.user_id')
        .leftJoin(this.userContentsSubquery, 'suc.post_id', 'posts.id')
        .leftJoin(this.userVoteSubquery(userId), 'vs.pv_post_id', 'posts.id')
        .where({ 'ucs.user_id': userId });
      return query;
    });
  }

  async selectPostByIdForLoggedIn(
    userId: uuid,
    postId: uuid
  ): Promise<void | PostDetailsOut> {
    return this._queryBuilder((table) => {
      return table
        .first(this._user_post_columns)
        .join({ cp: 'community_posts' }, 'cp.post_id', 'posts.id')
        .join({ c: 'communities' }, 'c.id', 'cp.community_id')
        .join(
          { ucs: 'user_community_subscriptions' },
          'ucs.community_id',
          'c.id'
        )
        .join({ up: 'user_posts' }, 'up.post_id', 'posts.id')
        .join({ u: 'users' }, 'u.id', 'up.user_id')
        .leftJoin(this.userContentsSubquery, 'suc.post_id', 'posts.id')
        .leftJoin(this.userVoteSubquery(userId), 'vs.pv_post_id', 'posts.id')
        .where({ 'ucs.user_id': userId, 'posts.id': postId });
    });
  }

  /**
   * Selects the posts that the visitors see
   */
  async selectVisitorPosts(): Promise<PostListOut | void> {
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
        .leftJoin(this.userContentsSubquery, 'suc.post_id', 'posts.id')
        .select(this._visitor_post_columns);
    });
  }

  /**
   * Selects a single post from the database by its slug
   *
   * @param postSlug slug for the post to be returned
   */
  async selectVisitorPostBySlug(
    postSlug: PostSlug
  ): Promise<PostDetailsOut | void> {
    return this._queryBuilder((table) => {
      return table
        .first(this._visitor_post_columns)
        .join({ up: 'user_posts' }, 'posts.id', 'up.post_id')
        .join({ u: 'users' }, 'u.id', 'up.user_id')
        .join({ cp: 'community_posts' }, 'cp.post_id', 'posts.id')
        .join({ c: 'communities' }, 'c.id', 'cp.community_id')
        .leftJoin(this.userContentsSubquery, 'suc.post_id', 'posts.id')
        .where({ 'posts.slug': postSlug });
    });
  }

  async insert(
    input: PostInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<{ id: uuid }[] | void> {
    const prepare = ({
      title,
      body,
    }: PostInsertPrepareIn): PostInsertPrepareOut => ({
      title,
      body,
      slug: _.kebabCase(title),
    });
    return this._insert(input, prepare, ['id'], transaction, rollback);
  }

  /**
   * Updates the like and dislike counts on a post
   *
   * @remarks
   * This method demands a transaction to execute
   *
   * @param postId: Id for the post whose votes will be updated
   * @param likeIncrement increment amount for like
   * @param dislikeIncrement increment amount for dislike
   * @param transaction knex transaction object
   * @param rollback rollback function in case the transaction fails
   */
  async updatePostVote(
    postId: string,
    likeIncrement: number,
    dislikeIncrement: number,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<void | { like_count: number; dislike_count: number }[]> {
    return this._queryBuilder((table) => {
      return table
        .transacting(transaction)
        .increment('like_count', likeIncrement)
        .increment('dislike_count', dislikeIncrement)
        .where('id', postId)
        .returning(['like_count', 'dislike_count']);
    });
  }
}

export default new PostStore({
  singular: 'post',
  plural: 'posts',
  connector: postgres,
});
