import type { uuid } from '../../@types/helpers.types';
import { PostCommentsOut, CommentSaveOut } from 'six__server__ep-types';
import { CommentUpPl } from 'six__server__pl-types';
import comment from '../../models/comment/comment.model';
import userComment from '../../models/user-comment/user-comment.model';
import postComment from '../../models/post-comment/post-comment.model';
import post from '../../models/post/post.model';
import postgres from '../../connectors/postgres';
import ERRORS from '../../errors';

export class CommentsAccess {
  postCommentsList(postId: uuid): Promise<void | PostCommentsOut> {
    return comment.selectByPostId(postId);
  }

  save({
    parentId,
    body,
    userId,
    postId,
  }: CommentUpPl['_router']['In']): Promise<void | CommentSaveOut> {
    try {
      return postgres.transaction(async (transaction) => {
        const commentInsertRows = await comment.insert(
          { parentId, body, userId, postId },
          transaction
        );
        if (!commentInsertRows) {
          throw new Error(ERRORS.COMMENT_INSERT);
        }
        const commentId = commentInsertRows[0].id;

        const postCommentInsertRows = await postComment.insert(
          { commentId, postId },
          transaction
        );
        if (!postCommentInsertRows) {
          throw new Error(ERRORS.POST_COMMENT_INSERT);
        }

        const userCommentInsertRows = await userComment.insert(
          { userId, commentId },
          transaction
        );
        if (!userCommentInsertRows) {
          throw new Error(ERRORS.USER_COMMENT_INSERT);
        }

        const postUpdateRows = await post.incrementCommentCountByPostId(
          postId,
          1
        );

        return {
          parentId,
          body,
          userId,
          postId,

          id: commentId,
          createdAt: '',
          likeCount: 0,
          dislikeCount: 0,
          postSlug: '',
          creatorUsername: 'utkusarioglu',
          state: 'submitted',
        };
      });
    } catch (e) {
      console.error('comment access', e);
      return Promise.resolve();
    }
  }
}

export default new CommentsAccess();
