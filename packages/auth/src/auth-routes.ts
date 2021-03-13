import type {
  UserSession,
  UserLogin,
  UserLogout,
  UserSignup,
} from 'six__server__ep-types';
import express from 'express';
import store from 'six__server__store';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { validateEndpoint } from './helpers';
import { validateSingupProps } from './validation/pack';

const router = express.Router();

(() => {
  type Method = UserSession;
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/session/v1/:requestId'),
    ({ params: { requestId }, user }, res) => {
      // if there is no user session
      if (!user) {
        return res.json({
          id: requestId,
          state: 'success' as 'success',
          body: {
            state: 'visitor',
          },
        });
      }

      const { username, age, id, email } = user;
      // if there is a user session
      res.json({
        id: requestId,
        state: 'success' as 'success',
        body: {
          id,
          age,
          username,
          email,
          state: 'logged-in',
        },
      });
    }
  );
})();

(() => {
  type Method = UserLogin;
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/login/v1/:requestId'),
    (req, res, next) => {
      // destructuring these inside the function body as
      // passport needs req, res, next for its call
      const {
        params: { requestId },
      } = req;

      passport.authenticate('local', (err, user) => {
        if (err) {
          return res.json({
            id: requestId,
            state: 'fail',
            errors: {
              general: 'AUTH_FAILURE',
            },
          });
        }

        if (!user) {
          return res.json({
            id: requestId,
            state: 'fail' as 'fail',
            errors: {
              general: 'USER_NOT_FOUND',
            },
          });
        }

        req.login(user, (err) => {
          if (err) {
            res.json({
              id: requestId,
              state: 'fail',
              errors: {
                general: 'LOGIN_FAILURE',
              },
            });
          }

          const { username, age, id, email } = user;

          return res.json({
            id: requestId,
            state: 'success',
            body: {
              ...user,
              state: 'logged-in',
              username,
              age,
              id,
              email,
            },
          });
        });
      })(req, res, next);
    }
  );
})();

(() => {
  type Method = UserLogout;
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/logout/v1/:requestId'),
    async (req, res) => {
      const {
        params: { requestId },
        user,
      } = req;
      if (user) {
        req.logout();
      }

      res.json({
        id: requestId,
        state: 'success' as 'success',
        body: {
          state: 'visitor',
        },
      });
    }
  );
})();

(() => {
  type Method = UserSignup;
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/signup/v1/:requestId'),
    async (req, res, next) => {
      // Cannot destructure in params as passport.login fails to work
      // properly with destructuring
      const {
        body,
        params: { requestId },
      } = req;
      const { password, email } = body;

      const errors = validateSingupProps(body);

      if (Object.keys(errors).length) {
        return res.json({
          id: requestId,
          state: 'fail',
          errors,
        });
      }

      const user = await store.user.selectByEmail(email);

      if (user !== false) {
        return res.json({
          id: requestId,
          state: 'fail',
          errors: {
            email: 'EMAIL_IN_USE',
          },
        });
      }

      const passwordHashed = await bcrypt.hash(password, 10);
      const id = uuidv4();
      const userModel = {
        ...body,
        id,
        password: passwordHashed,
      };

      await store.user._insert(userModel);

      const userLogin = {
        ...body,
        id,
        state: 'logged-in' as 'logged-in',
      };

      req.login(userLogin, (err: string) => {
        if (err) {
          return next(err);
        }

        return res.json({
          id: requestId,
          state: 'success',
          body: userLogin,
        });
      });
    }
  );
})();

export default router;
