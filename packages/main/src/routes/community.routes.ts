import type { CommunityList, CommunitySingle } from 'six__server__ep-types';
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
    validateEndpoint<Endpoint>('/communities/v1/:requestId'),
    async (req, res) => {
      const {
        params: { requestId },
        user,
      } = req;

      try {
        const communitiesList = await store.communities.list(user.id);

        if (!communitiesList) {
          throw new Error();
        }

        res.json({
          id: requestId,
          state: 'success',
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
