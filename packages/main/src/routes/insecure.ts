import express from 'express';
import store from 'six__server__store';
import type {
  PostEndpoint,
  CommunityEndpoint,
  UserEndpoint,
  CommentEndpoint,
} from 'six__public-api';
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

      if (req.user) {
        const userPosts = await store.post.selectUserPosts(req.user.id);

        const response: Response = {
          id: requestId,
          state: 'success',
          body: userPosts,
        };

        return res.json(response);
      } else {
        const visitorPosts = await store.post.selectVisitorPosts();

        const response: Response = {
          id: requestId,
          state: 'success',
          body: visitorPosts,
        };

        return res.json(response);
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
      const commentsList = await store.comment.selectByPostId(postId);

      res.json({
        id: requestId,
        state: 'success' as 'success',
        body: commentsList,
      });
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

      const post = await store.post
        .selectPostBySlug(postSlug)
        .then((posts) => posts.pop())
        .catch(console.error);

      const postsResponse: Response = {
        id: requestId,
        state: 'success' as 'success',
        body: post,
      };

      res.json(postsResponse);
    }
  );
})();

(() => {
  type Method = CommunityEndpoint['_list']['_v1'];
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/communities/:requestId'),
    async (req, res) => {
      const { requestId } = req.params;

      const communitiesList =
        (await store.community.selectAllForCommunityFeed()) || [];

      const communitiesResponse: Response = {
        id: requestId,
        state: 'success' as 'success',
        body: communitiesList,
      };

      res.json(communitiesResponse);
    }
  );
})();

(() => {
  type Method = UserEndpoint['_user_community_subscription']['_alter']['_v1'];
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.post<Params, Response>(
    validateEndpoint<Endpoint>(
      'user/:username/:actionType/:communityId/:requestId'
    ),
    async (req, res) => {
      const { requestId, username, communityId } = req.params;
      try {
        const subscription = await store.userCommunitySubscription._insert({
          user_id: username,
          community_id: communityId,
        });

        if (subscription) {
          const response: Response = {
            id: requestId,
            state: 'success' as 'success',
            body: {
              communityId: subscription[0].community_id,
              userId: subscription[0].user_id,
            },
          };
          res.json(response);
        } else {
          const response: Response = {
            id: requestId,
            state: 'fail' as 'fail',
            errors: {
              general: 'SUBSCRIPTION_SAVE_FAIL',
            },
          };
          res.json(response);
        }
      } catch (error) {
        const response: Response = {
          id: requestId,
          state: 'fail' as 'fail',
          errors: {
            general: 'SUBSCRIPTION_SAVE_FAIL',
          },
        };
        res.json(response);
      }
    }
  );
})();

export default router;
