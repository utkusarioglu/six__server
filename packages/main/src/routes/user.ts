import express, { request } from 'express';
import store from 'six__server__store';
import type { UserEndpoint } from 'six__public-api';
import { validateEndpoint } from '../helpers';

const router = express.Router();

(() => {
  type Method = UserEndpoint['_user_community_subscription']['_alter']['_v1'];
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  // todo doesn't cover unsubscribe
  router.post<Params, Response>(
    validateEndpoint<Endpoint>(
      '/user/:userId/:actionType/:communityId/:requestId'
    ),
    async ({ params: { requestId, userId, communityId, actionType } }, res) => {
      try {
        switch (actionType) {
          case 'subscribe':
            const subscription = await store.userCommunitySubscription.insert({
              userId,
              communityId,
            });

            if (!subscription) {
              throw new Error('SUBSCRIBE_FAIL');
            }

            break;
          case 'unsubscribe':
            const unsubscribe = await store.userCommunitySubscription.delete(
              communityId
            );

            if (unsubscribe === 0) {
              throw new Error('UNSUBSCRIBE_FAIL');
            }

            break;

          default:
            throw new Error('ILLEGAL_ACTION_TYPE');
        }

        // Values are reflected back to the client, this may cause issues
        res.json({
          id: requestId,
          state: 'success',
          body: {
            communityId,
            userId,
            actionType,
          },
        });
      } catch (e) {
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: e || 'UCS_GENERAL_FAIL',
          },
        });
      }
    }
  );
})();

(() => {
  type Method = UserEndpoint['_user_community_subscription']['_id_list']['_v1'];
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/user/:userId/subscriptions/id/:requestId'),
    async ({ params: { requestId, userId } }, res) => {
      try {
        const ids = await store.userCommunitySubscription.getCommunityIdsForUserId(
          userId
        );

        if (!ids) {
          throw new Error();
        }

        res.json({
          id: requestId,
          state: 'success',
          body: ids,
        });
      } catch (e) {
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'COMMUNITY_ID_FETCH_ERROR',
          },
        });
      }
    }
  );
})();

export default router;
