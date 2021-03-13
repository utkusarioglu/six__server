import type { UserUcsAlter, UserUcsIdList } from 'six__server__ep-types';
import express from 'express';
import store from 'six__server__store';
import { validateEndpoint } from '../helpers';

const router = express.Router();

(() => {
  type Method = UserUcsAlter;
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  // todo doesn't cover unsubscribe
  router.post<Params, Response>(
    validateEndpoint<Endpoint>('/user/ucs/:requestId'),
    async (
      { params: { requestId }, body: { userId, communityId, actionType } },
      res
    ) => {
      try {
        const subscriptionResponse = await store.users.alterUcs({
          actionType,
          userId,
          communityId,
        });

        if (!subscriptionResponse) {
          throw new Error('UCS_ALTER_FAIL');
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
        console.error(e);
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'UCS_GENERAL_FAIL',
          },
        });
      }
    }
  );
})();

(() => {
  type Method = UserUcsIdList;
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/user/:userId/subscriptions/id/v1/:requestId'),
    async ({ params: { requestId, userId } }, res) => {
      try {
        const ids = await store.users.getUcsIds(userId);

        if (!ids) {
          throw new Error();
        }

        res.json({
          id: requestId,
          state: 'success',
          body: ids,
        });
      } catch (e) {
        console.error(e);
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
