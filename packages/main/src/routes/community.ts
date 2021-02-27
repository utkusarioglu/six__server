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

export default router;
