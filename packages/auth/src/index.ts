import Passport from 'passport';
import passportLocal from 'passport-local';
import expressSession from 'express-session';
import store from 'six__server__store';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  emailValid,
  passwordLengthValid,
  passwordStrengthAcceptable,
  isValidEmail,
  isValidAge,
} from './validation/validation';
import { SESSION_SECRET, SECURE_SCHEMES } from 'six__server__global';
import type { Express, Request, Response, NextFunction } from 'express';
import type { UserInsert } from 'six__server__store/src/models/user/user.types';
import type {
  UserLoginPostRes,
  UserSessionGetRes,
  UserLogoutPostRes,
} from 'six__public-api';

const LocalStrategy = passportLocal.Strategy;

Passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      if (!emailValid(email)) {
        return done('username not within length params');
      }

      if (!passwordLengthValid(password)) {
        return done('pass not within length params');
      }

      store.user.selectByEmail(email).then((user: Express.User | false) => {
        if (!user) {
          return done(null, false);
        }

        bcrypt.compare(password, user.password).then((result) => {
          if (!result) {
            return done(null, false);
          }
          return done(null, user);
        });
      });
    }
  )
);

Passport.serializeUser((user, done) => {
  done(null, user);
});

Passport.deserializeUser<Express.User>((user, done) => {
  done(null, user);
});

export function useAuth(app: Express) {
  app.use(
    expressSession({
      proxy: true,
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      genid: (_req) => {
        return uuidv4();
      },
      cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        secure: SECURE_SCHEMES,
      },
      store: store.sessionConnector(expressSession),
    })
  );
  app.use(Passport.initialize());
  app.use(Passport.session());

  app.get('/api/session', (req, res) => {
    if (req.user) {
      const sessionInfo: UserSessionGetRes = {
        id: 'some_id',
        res: {
          ...req.user,
          // @ts-ignore
          loggedIn: true,
        },
      };
      res.json(sessionInfo);
    } else {
      const sessionInfo: UserSessionGetRes = {
        id: 'some_id',
        // @ts-ignore
        res: { loggedIn: false },
      };
      res.json(sessionInfo);
    }
  });

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.json({ message: 'failed' });
      }

      req.login(user, (err) => {
        if (err) {
          console.warn(`login error:\n${err}`);
          return next(err);
        }

        const { username, age, id, email } = user;

        const userLoginSuccess: UserLoginPostRes = {
          id: 'some_id',
          res: {
            loggedIn: true,
            username,
            age,
            id,
            email,
          },
        };

        return res.json(userLoginSuccess);
      });
    })(req, res, next);
  });

  app.post('/api/logout', async (req, res, next) => {
    if (req.user) {
      req.logout();
      // UserLogoutPostRes;
      // next(null);
      const logoutResponse: UserLogoutPostRes = {
        id: 'some id',
        res: {
          loggedIn: false,
        },
      };

      res.json(logoutResponse);
    } else {
      const logoutResponse: UserLogoutPostRes = {
        id: 'some id',
        res: {
          loggedIn: false,
        },
      };
      res.json(logoutResponse);

      // next("wasn't logged in");
    }
  });

  app.post('/api/signup', async (req, res, next) => {
    const { username, password, email, age } = req.body;

    if (!emailValid(email)) {
      return res.json({ error: 'email boo' });
    }

    if (!passwordLengthValid(password)) {
      return res.json({ error: 'password length boo' });
    }

    if (!passwordStrengthAcceptable(password)) {
      return res.json({ error: 'password weak' });
    }

    if (!isValidEmail(email)) {
      return res.json({ error: 'email not valid' });
    }

    if (!isValidAge(age)) {
      return res.json({ error: 'ageist' });
    }

    store.user
      .selectByEmail(username)
      .then(async (user) => {
        if (user === false) {
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
                const userLogin: Express.User = (({
                  id,
                  username,
                  password,
                }) => ({
                  id,
                  username,
                  password,
                }))(userModel);

                req.login(userLogin, (err: string) => {
                  if (err) {
                    return next(err);
                  }

                  return res.json({
                    id: 'some_id',
                    res: { ...userLogin, loggedIn: true },
                  });
                });
              });
            })
            // hash fail
            .catch(console.error);
        } else {
          return res.json({ error: 'user with username already exists' });
        }
      })
      .catch(console.error);
  });
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    next();
  }
  // TODO this shall be connected to somewhere more meaningful
  res.redirect('/api/headers');
}

export const passport = Passport;
