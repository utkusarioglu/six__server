import type {
  PostList,
  PostComments,
  PostDetails,
  PostVote,
  PostCreate,
} from 'six__server__ep-types';
import express from 'express';
import store from 'six__server__store';
import { validateEndpoint } from '../helpers';

const router = express.Router();

(() => {
  type Method = PostList;
  type Response = Method['_get']['_res']['Union'];
  type Params = Method['_get']['_req']['Params'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/posts/v1/:requestId'),
    async ({ params: { requestId }, user }, res) => {
      try {
        const posts = await store.posts.feed(user && user.id);

        if (!posts) {
          throw new Error('POSTS_ROUTE_FETCH');
        }

        return res.json({
          id: requestId,
          state: 'success',
          body: posts,
        });
      } catch (e) {
        console.log('error', e);
        return res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'POSTS_ROUTE_GENERAL',
          },
        });
      }
    }
  );
})();

(() => {
  type Method = PostComments;
  type Response = Method['_get']['_res']['Union'];
  type Params = Method['_get']['_req']['Params'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/post/:postId/comments/v1/:requestId'),
    async ({ params: { postId, requestId } }, res) => {
      try {
        const postCommentsList = await store.comments.postCommentsList(postId);

        if (!postCommentsList) {
          throw new Error();
        }

        return res.json({
          id: requestId,
          state: 'success',
          body: postCommentsList,
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
  type Method = PostDetails;
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/post/slug/v1/:postSlug/:requestId'),
    async ({ params: { postSlug, requestId }, user }, res) => {
      try {
        const post = await store.posts.singleByPostSlug(
          user && user.id,
          postSlug
        );

        if (!post) {
          throw new Error();
        }

        return res.json({
          id: requestId,
          state: 'success',
          body: post,
        });
      } catch (e) {
        console.error(e);
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
  type Method = PostVote;
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/post/vote/v1/:requestId'),
    async ({ params: { requestId }, body }, res) => {
      try {
        const postsVote = await store.posts.vote(body);

        if (!postsVote) {
          throw new Error('POST_VOTE_INSERT_FAIL');
        }

        res.json({
          id: requestId,
          state: 'success',
          body: postsVote,
        });
      } catch (e) {
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'POST_VOTE_GENERAL',
          },
        });
      }
    }
  );
})();

(() => {
  type Method = PostCreate;
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/post/create/v1/:requestId'),
    async ({ params: { requestId }, body }, res) => {
      try {
        const postCreate = await store.posts.create(body);

        if (!postCreate) {
          throw new Error('POST_CREATE');
        }

        res.json({
          id: requestId,
          state: 'success',
          body: postCreate,
        });
      } catch (e) {
        console.error(e);
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'POST_CREATE',
          },
        });
      }
    }
  );
})();

export default router;
