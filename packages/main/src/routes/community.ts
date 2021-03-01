import express from 'express';
import store from 'six__server__store';
import type { CommunityEndpoint } from 'six__public-api';
import { validateEndpoint } from '../helpers';

const router = express.Router();

(() => {
  type Method = CommunityEndpoint['_list']['_v1'];
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/communities/:requestId'),
    async ({ params: { requestId } }, res) => {
      try {
        const communitiesList =
          (await store.community.selectAllForCommunityFeed()) || [];

        if (!communitiesList) {
          throw new Error();
        }

        res.json({
          id: requestId,
          state: 'success' as 'success',
          body: communitiesList,
        });
      } catch {
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
  type Method = CommunityEndpoint['_single']['_v1'];
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/community/:communitySlug/:requestId'),
    async ({ params: { requestId, communitySlug } }, res) => {
      try {
        const communities = await store.community.selectBySlug(communitySlug);

        if (!communities.length) {
          throw new Error('COMMUNITY_FETCH_ERROR');
        }

        const community = communities[0];

        res.json({
          id: requestId,
          state: 'success',
          body: community,
        });
      } catch (e) {
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

export default router;
