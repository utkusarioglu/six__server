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
import type { UserInsert } from 'six__server__store/src/models/user/user.types';
import type { User } from 'six__public-api';
import { validateEndpoint } from './helpers';

const router = express.Router();

router.get<
  User['Session']['v1']['Get']['Req']['Params'],
  User['Session']['v1']['Get']['Res']['Union']
>(
  validateEndpoint<User['Session']['v1']['Endpoint']>('/session/v1/:requestId'),
  (req, res) => {
    const { requestId } = req.params;

    console.log(req.user);
    // if there is no user session
    if (!req.user) {
      const sessionInfo = {
        id: requestId,
        state: 'success' as 'success',

        body: {
          error: true as true,
          loggedIn: false as false,
        },
      };
      return res.json(sessionInfo);
    }
    console.log('should reach here');

    // @ts-ignore
    const { username, age, id, email } = req.user;
    // if there is a user session
    const sessionInfo = {
      id: requestId,
      state: 'success' as 'success',
      body: {
        id,
        age,
        username,
        email,
        loggedIn: true as true,
      },
    };
    res.json(sessionInfo);
  }
);

router.post<
  User['Login']['v1']['Post']['Req']['Params'],
  User['Login']['v1']['Post']['Res']['Union'],
  User['Login']['v1']['Post']['Req']['Body']
>(
  validateEndpoint<User['Login']['v1']['Endpoint']>('/login/v1/:requestId'),
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

        const userLoginSuccess = {
          id: requestId,
          state: 'success' as 'success',
          body: {
            loggedIn: true as true,
            username,
            age,
            id,
            email,
          },
        };

        return res.json(userLoginSuccess);
      });
    })(req, res, next);
  }
);

router.post<
  User['Logout']['v1']['Post']['Req']['Params'],
  User['Logout']['v1']['Post']['Res']['Union'],
  User['Logout']['v1']['Post']['Req']['Body']
>(
  validateEndpoint<User['Logout']['v1']['Endpoint']>('/logout/v1/:requestId'),
  async (req, res) => {
    const { requestId } = req.params;

    if (req.user) {
      req.logout();
    } else {
      console.log(`User wasn't logged in`);
    }

    const logoutResponse = {
      id: requestId,
      state: 'success' as 'success',
      body: {
        loggedIn: false as false,
      },
    };

    res.json(logoutResponse);
  }
);

router.post<
  User['Signup']['v1']['Post']['Req']['Params'],
  User['Signup']['v1']['Post']['Res']['Union'],
  User['Signup']['v1']['Post']['Req']['Body']
>(
  validateEndpoint<User['Signup']['v1']['Endpoint']>('/signup/v1/:requestId'),
  async (req, res, next) => {
    const { requestId } = req.params;
    const { username, password, email, age } = req.body;
    const errors: Partial<User['Signup']['v1']['Post']['Req']['Body']> = {};

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
            const userModel: UserInsert = {
              id: uuidv4(),
              username,
              password: passwordHashed,
              email,
              age,
            };
            store.user.insert(userModel).then(() => {
              const userLogin = {
                id: userModel.id,
                username: userModel.username,
                email: userModel.email,
                age: userModel.age,
              };

              req.login(userLogin, (err: string) => {
                if (err) {
                  return next(err);
                }

                return res.json({
                  id: requestId,
                  state: 'success' as 'success',
                  body: {
                    ...userLogin,
                    loggedIn: true,
                  },
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

export default router;
