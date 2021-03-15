import type {
  PostVoteIn,
  PostVoteOut,
  PostCreateIn,
  PostCreateOut,
  PostListOut,
  PostDetailsOut,
  VoteTypes,
} from 'six__server__ep-types';
import type { Transaction } from 'knex';
import type { SelectPostVotesOut } from '../../models/vote/vote.model.types';
import type { uuid } from '../../@types/helpers.types';
import postVote from '../../models/post-vote/post-vote.model';
import userVote from '../../models/user-vote/user-vote.model';
import userContent from '../../models/user-content/user-content.model';
import postUserContent from '../../models/post-user-content/post-user-content.model';
import userPost from '../../models/user-post/user-post.model';
import vote from '../../models/vote/vote.model';
import post from '../../models/post/post.model';
import postgres from '../../connectors/postgres';
import ERRORS from '../../errors';
import communityPost from '../../models/community-post/community-post.model';

export class PostsAccess {
  async singleByPostSlug(
    userId: uuid,
    postSlug: string
  ): Promise<void | PostDetailsOut> {
    return userId
      ? post.selectPostBySlugAndUserId(userId, postSlug)
      : post.selectVisitorPostBySlug(postSlug);
  }

  async feed(userId?: uuid): Promise<void | PostListOut> {
    return userId
      ? await post.selectPostFeedPostsForLoggedIn(userId)
      : await post.selectVisitorPosts();
  }

  async create({
    title,
    body,
    mediaImagePath,
    communityId,
    userId,
  }: PostCreateIn): Promise<void | PostCreateOut> {
    try {
      const postId = await postgres.transaction(async (transaction) => {
        const postInsertRows = await post.insert({ title, body }, transaction);
        if (!postInsertRows) {
          throw new Error(ERRORS.POST_INSERT);
        }
        const postId = postInsertRows[0].id;

        const userPostRows = await userPost.insert(
          { postId, userId },
          transaction
        );
        if (!userPostRows) {
          throw new Error(ERRORS.USER_POST_INSERT);
        }

        const communityPostRows = await communityPost.insert(
          { postId, communityId },
          transaction
        );
        if (!communityPostRows) {
          throw new Error(ERRORS.COMMUNITY_POST_INSERT);
        }

        if (mediaImagePath) {
          const userContentRows = await userContent.insert(
            {
              filename: mediaImagePath,
              // ! this should be temporary
              type: mediaImagePath !== '' ? 'image/jpeg' : '',
            },
            transaction
          );
          if (!userContentRows) {
            throw new Error(ERRORS.USER_CONTENT_INSERT);
          }
          const userContentId = userContentRows[0].id;

          const postUserContentRows = await postUserContent.insert(
            {
              postId,
              userContentId,
            },
            transaction
          );
          if (!postUserContentRows) {
            throw new Error(ERRORS.POST_USER_CONTENT_INSERT);
          }
        }

        await this.createNewVote(
          { voteType: 1, userId, postId },
          1,
          0,
          transaction
        );

        return postId;
      });

      return post.selectPostByIdForLoggedIn(userId, postId);
    } catch (e) {
      console.error(e);
      return Promise.resolve();
    }
  }

  async vote({
    voteType,
    userId,
    postId,
  }: PostVoteIn): Promise<void | PostVoteOut> {
    const existing = await vote.selectPostVotesForUserId(postId, userId);
    if (!!existing) {
      await this.deleteVote(existing, voteType, userId, postId);
    }

    if (!existing || existing.voteType !== voteType) {
      await this.createNewVote(
        { voteType, userId, postId },
        voteType === 1 ? 1 : 0,
        voteType === -1 ? 1 : 0
      );
    }

    const finalPost = await post.selectPostByIdForLoggedIn(userId, postId);

    if (!finalPost) {
      throw new Error(ERRORS.POST_SELECT);
    }

    return {
      id: finalPost.id,
      likeCount: finalPost.likeCount,
      dislikeCount: finalPost.dislikeCount,
      userVote: finalPost.userVote,
    };
  }

  private async deleteVote(
    existing: SelectPostVotesOut,
    voteType: VoteTypes,
    userId: string,
    postId: string
  ) {
    return postgres.transaction(async (transaction) => {
      await vote.deleteById(existing.voteId, transaction);

      await post.updatePostVote(
        postId,
        existing.voteType === 1 ? -1 : 0,
        existing.voteType === -1 ? -1 : 0,
        transaction
      );

      return {
        voteType,
        userId,
        postId,
      };
    });
  }

  async createNewVote(
    input: PostVoteIn,
    likeIncrement: number,
    dislikeIncrement: number,
    transaction?: Transaction
  ) {
    const queries = async (
      input: PostVoteIn,
      likeIncrement: number,
      dislikeIncrement: number,
      transaction: Transaction
    ) => {
      const voteRows = await vote.insert(
        {
          voteType: input.voteType,
        },
        transaction
      );

      if (!voteRows || !voteRows.length) {
        throw new Error(ERRORS.VOTE_INSERT);
      }
      const voteId = voteRows[0].id;

      const postVoteRows = await postVote.insert(
        {
          voteId,
          ...input,
        },
        transaction
      );

      if (!postVoteRows) {
        throw new Error(ERRORS.POST_VOTE);
      }

      const userVoteRows = await userVote.insert(
        {
          voteId,
          ...input,
        },
        transaction
      );

      if (!userVoteRows) {
        throw new Error(ERRORS.USER_VOTE);
      }

      const postUpdate = await post.updatePostVote(
        input.postId,
        likeIncrement,
        dislikeIncrement,
        transaction
      );

      if (!postUpdate) {
        throw new Error(ERRORS.POST_UPDATE);
      }

      return postUpdate[0];
    };

    try {
      if (transaction) {
        return await queries(
          input,
          likeIncrement,
          dislikeIncrement,
          transaction
        );
      } else {
        return postgres.transaction(async (transaction) => {
          return await queries(
            input,
            likeIncrement,
            dislikeIncrement,
            transaction
          );
        });
      }
    } catch (e) {
      console.error(e);
      return;
    }
  }
}

export default new PostsAccess();
