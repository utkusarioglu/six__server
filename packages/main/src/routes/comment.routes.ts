import type { CommentSave } from 'six__server__ep-types';
import express from 'express';
import store from 'six__server__store';
import { validateEndpoint } from '../helpers';

const router = express.Router();

(() => {
  type Method = CommentSave;
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/comment/save/v1/:requestId'),
    async ({ params: { requestId }, body }, res) => {
      try {
        const commentSave = await store.comments.save(body);

        if (!commentSave) {
          throw new Error('COMMENT_SAVE');
        }

        res.json({
          id: requestId,
          state: 'success',
          body: commentSave,
        });
      } catch (e) {
        console.error(e);
        res.json({
          id: requestId,
          state: 'fail',
          errors: {
            general: 'COMMENT_SAVE_GENERAL',
          },
        });
      }
    }
  );
})();

export default router;
