import express from 'express';
import store from 'six__server__store';
import type { CommentEndpoint } from 'six__public-api';
import { validateEndpoint } from '../helpers';

const router = express.Router();

(() => {
  type Method = CommentEndpoint['_save']['_v1'];
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/comment/save/:requestId'),
    async (req, res) => {
      const { requestId } = req.params;
      const { parentId, body, userId, postId } = req.body;

      try {
        const commentSave = await store.comment.insert({
          body,
          parentId,
          userId,
          postId,
        });

        if (!commentSave) {
          throw new Error();
        }

        res.json({
          id: requestId,
          state: 'success' as 'success',
          body: commentSave,
        });
      } catch (e) {
        res.json({
          id: requestId,
          state: 'fail' as 'fail',
          errors: {
            general: 'COMMENT_SAVE_FAIL',
          },
        });
      }
    }
  );
})();

export default router;
