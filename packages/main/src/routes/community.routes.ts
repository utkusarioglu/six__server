import type {
  CommunityList,
  CommunitySingle,
  CommunityPosts,
  CommunityCreate,
} from 'six__server__ep-types';
import express from 'express';
import store from 'six__server__store';
import { validateEndpoint } from '../helpers';

const router = express.Router();

(() => {
  type Method = CommunityList;
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/community/list/v1/:requestId'),
    async (req, res) => {
      const {
        params: { requestId },
        user,
      } = req;

      try {
        const communitiesList = await store.communities.list(user && user.id);

        if (!communitiesList) {
          throw new Error();
        }

        res.json({
          id: requestId,
          state: 'success',
          body: communitiesList,
        });
      } catch (e) {
        console.error(e);
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'COMMUNITY_LIST_FAIL',
          },
        });
      }
    }
  );
})();

(() => {
  type Method = CommunitySingle;
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/community/v1/:communitySlug/:requestId'),
    async ({ params: { requestId, communitySlug } }, res) => {
      try {
        const communitiesSingle = await store.communities.single(communitySlug);

        if (!communitiesSingle) {
          throw new Error('COMMUNITY_FETCH_ERROR');
        }

        res.json({
          id: requestId,
          state: 'success',
          body: communitiesSingle,
        });
      } catch (e) {
        console.error(e);
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: e || 'COMMUNITIES_SINGLE',
          },
        });
      }
    }
  );
})();

(() => {
  type Method = CommunityPosts;
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/community/posts/v1/:communitySlug/:requestId'),
    async ({ params: { requestId, communitySlug }, user }, res) => {
      try {
        const communityPosts = await store.posts.communityFeed(
          communitySlug,
          user && user.id
        );

        if (!communityPosts) {
          throw new Error('COMMUNITY_POSTS_FETCH_ERROR');
        }

        res.json({
          id: requestId,
          state: 'success',
          body: communityPosts,
        });
      } catch (e) {
        console.error(e);
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'COMMUNITY_POST_GENERAL',
          },
        });
      }
    }
  );
})();

(() => {
  type Method = CommunityCreate;
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/community/create/v1/:requestId'),
    async ({ params: { requestId }, body, user }, res) => {
      try {
        if (!user) {
          throw new Error('COMMUNITY_CREATE_NO_USER');
        }

        const communityCreate = await store.communities.create(body, user.id);

        if (!communityCreate) {
          throw new Error('COMMUNITY_CREATE_FAIL');
        }

        res.json({
          id: requestId,
          state: 'success',
          body: communityCreate,
        });
      } catch (e) {
        console.error(e);
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'COMMUNITY_CREATE',
          },
        });
      }
    }
  );
})();

export default router;
