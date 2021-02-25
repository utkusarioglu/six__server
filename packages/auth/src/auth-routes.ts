import express from 'express';
import store from 'six__server__store';
import passport from 'passport';
import {
  passwordLengthValid,
  passwordStrengthAcceptable,
  isValidEmail,
  isValidAge,
} from './validation/validation';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import type { UserEndpoint } from 'six__public-api';
import { validateEndpoint } from './helpers';

const router = express.Router();

(() => {
  type Method = UserEndpoint['_session']['_v1'];
  type Params = Method['_get']['_req']['Params'];
  type Response = Method['_get']['_res']['Union'];
  type Endpoint = Method['Endpoint'];

  router.get<Params, Response>(
    validateEndpoint<Endpoint>('/session/v1/:requestId'),
    (req, res) => {
      const { requestId } = req.params;

      // if there is no user session
      if (!req.user) {
        return res.json({
          id: requestId,
          state: 'success' as 'success',
          body: {
            state: 'visitor',
          },
        });
      }
      console.log('should reach here');

      const { username, age, id, email } = req.user;
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
  type Method = UserEndpoint['_login']['_v1'];
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/login/v1/:requestId'),
    (req, res, next) => {
      const { requestId } = req.params;

      passport.authenticate('local', (err, user) => {
        if (err) {
          console.log(err);
          const response = {
            id: requestId,
            state: 'fail' as 'fail',
            errors: {
              general: 'AUTH_FAILURE',
            },
          };
          return res.json(response);
        }

        if (!user) {
          const response = {
            id: requestId,
            state: 'fail' as 'fail',
            errors: { general: 'USER_NOT_FOUND' },
          };
          return res.json(response);
        }

        req.login(user, (err) => {
          if (err) {
            const response = {
              id: requestId,
              state: 'fail' as 'fail',
              errors: { general: 'LOGIN_FAILURE' },
            };
            res.json(response);
          }

          const { username, age, id, email } = user;

          return res.json({
            id: requestId,
            state: 'success' as 'success',
            body: {
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
  type Method = UserEndpoint['_logout']['_v1'];
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/logout/v1/:requestId'),
    async (req, res) => {
      const { requestId } = req.params;

      if (req.user) {
        req.logout();
      } else {
        console.log(`User wasn't logged in`);
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
  type Method = UserEndpoint['_signup']['_v1'];
  type Params = Method['_post']['_req']['Params'];
  type Response = Method['_post']['_res']['Union'];
  type Endpoint = Method['Endpoint'];
  type Body = Method['_post']['_req']['Body'];

  router.post<Params, Response, Body>(
    validateEndpoint<Endpoint>('/signup/v1/:requestId'),
    async (req, res, next) => {
      const { requestId } = req.params;
      const { username, password, email, age } = req.body;
      const errors: Partial<Body> = {};

      if (!passwordLengthValid(password)) {
        errors.password = 'PASSWORD_LENGTH_ILLEGAL';
      }

      if (!passwordStrengthAcceptable(password)) {
        errors.password = 'PASSWORD_WEAK';
      }

      if (!isValidEmail(email)) {
        errors.email = 'EMAIL_INVALID';
      }

      if (!isValidAge(age)) {
        // @ts-ignore
        errors.age = 'AGE_INVALID';
      }

      // errors.username = 'USERNAME_STUPID';

      if (Object.keys(errors).length) {
        const response = {
          id: requestId,
          state: 'fail' as 'fail',
          errors,
        };

        // @ts-ignore
        return res.json(response);
      }

      store.user
        .selectByEmail(email)
        .then(async (user) => {
          if (user !== false) {
            const response = {
              id: requestId,
              state: 'fail' as 'fail',
              errors: {
                email: 'EMAIL_IN_USE',
              },
            };
            return res.json(response);
          }

          bcrypt
            .hash(password, 10)
            .then((passwordHashed) => {
              const userModel = {
                id: uuidv4(),
                username,
                password: passwordHashed,
                email,
                age,
              };
              store.user._insert(userModel).then(() => {
                const userLogin = {
                  id: userModel.id,
                  username: userModel.username,
                  email: userModel.email,
                  age: userModel.age,
                  state: 'logged-in' as 'logged-in',
                };

                req.login(userLogin, (err: string) => {
                  if (err) {
                    return next(err);
                  }

                  return res.json({
                    id: requestId,
                    state: 'success' as 'success',
                    body: userLogin,
                  });
                });
              });
            })
            // hash fail
            .catch(console.error);
        })
        .catch(console.error);
    }
  );
})();

export default router;