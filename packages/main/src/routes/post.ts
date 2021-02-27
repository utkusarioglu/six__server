import express from 'express';
import store from 'six__server__store';
import type { PostEndpoint } from 'six__public-api';
import { validateEndpoint } from '../helpers';

const router = express.Router();

(() => {
  type Method = PostEndpoint['_list']['_v1'];
  type Response = Method['_get']['_res']['Union'];
  type Params = Method['_get']['_req']['Params'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/posts/:requestId'),
    async ({ params: { requestId }, user }, res) => {
      try {
        const posts = user
          ? await store.post.selectUserPosts(user.id)
          : await store.post.selectVisitorPosts();

        if (!posts) {
          throw new Error();
        }

        return res.json({
          id: requestId,
          state: 'success',
          body: posts,
        });
      } catch (e) {
        return res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'POSTS_FETCH_ERROR',
          },
        });
      }
    }
  );
})();

(() => {
  type Method = PostEndpoint['_comments']['_v1'];
  type Response = Method['_get']['_res']['Union'];
  type Params = Method['_get']['_req']['Params'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/post/:postId/comments/:requestId'),
    async ({ params: { postId, requestId } }, res) => {
      try {
        const commentsList = await store.comment.selectByPostId(postId);

        if (!commentsList) {
          throw new Error();
        }

        return res.json({
          id: requestId,
          state: 'success' as 'success',
          body: commentsList,
        });
      } catch (e) {
        return res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'POST_FETCH_FAIL',
          },
        });
      }
    }
  );
})();

(() => {
  type Method = PostEndpoint['_single']['_v1'];
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/post/slug/:postSlug/:requestId'),
    async ({ params: { postSlug, requestId } }, res) => {
      try {
        const post = await store.post
          .selectPostBySlug(postSlug)
          .then((posts) => posts.pop());

        if (!post) {
          throw new Error();
        }

        return res.json({
          id: requestId,
          state: 'success' as 'success',
          body: post,
        });
      } catch (e) {
        return res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'POST_FETCH_FAIL',
          },
        });
      }
    }
  );
})();

export default router;
