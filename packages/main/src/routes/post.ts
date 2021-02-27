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
    async (req, res) => {
      const { requestId } = req.params;
      try {
        const posts = req.user
          ? await store.post.selectUserPosts(req.user.id)
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
    async (req, res) => {
      const { postId, requestId } = req.params;
      try {
        const commentsList = await store.comment.selectByPostId(postId);

        if (!commentsList) {
          throw new Error();
        }

        res.json({
          id: requestId,
          state: 'success' as 'success',
          body: commentsList,
        });
      } catch (e) {
        res.json({
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
    async (req, res) => {
      const { postSlug, requestId } = req.params;

      try {
        const post = await store.post
          .selectPostBySlug(postSlug)
          .then((posts) => posts.pop());

        if (!post) {
          throw new Error();
        }

        res.json({
          id: requestId,
          state: 'success' as 'success',
          body: post,
        });
      } catch (e) {
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'POST_FETCH_FAL',
          },
        });
      }
    }
  );
})();

export default router;
