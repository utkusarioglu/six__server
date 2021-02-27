import express from 'express';
import store from 'six__server__store';
import type { UserEndpoint } from 'six__public-api';
import { validateEndpoint } from '../helpers';

const router = express.Router();

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

        if (!subscription) {
          throw new Error();
        }

        res.json({
          id: requestId,
          state: 'success' as 'success',
          body: {
            communityId: subscription[0].community_id,
            userId: subscription[0].user_id,
          },
        });
      } catch (e) {
        res.json({
          id: requestId,
          state: 'fail' as 'fail',
          errors: {
            general: 'SUBSCRIPTION_SAVE_FAIL',
          },
        });
      }
    }
  );
})();

export default router;
