import Passport from 'passport';
import passportLocal from 'passport-local';
import expressSession from 'express-session';
import store from 'six__server__store';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  usernameLengthValid,
  passwordLengthValid,
  passwordStrengthAcceptable,
  isValidEmail,
  isValidAge,
} from './validation/validation';
import { SESSION_SECRET } from './config';
import type { Express, Request, Response, NextFunction } from 'express';
import type { UserModel } from '../../store/src/methods/auth';

const LocalStrategy = passportLocal.Strategy;

Passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      if (!usernameLengthValid(username)) {
        return done({ error: 'username not within length params' });
      }

      if (!passwordLengthValid(password)) {
        return done({ error: 'pass not within length params' });
      }

      store.auth.getUserByUsername(username).then((user) => {
        if (!user) {
          return done(null, false);
        }

        bcrypt.compare(password, user.password).then((result) => {
          console.log({ user, password, result });
          if (!result) {
            return done(null, false);
          }
          return done(null, user);
        });
      });
    }
  )
);

Passport.serializeUser(async (user, done) => {
  try {
    // @ts-ignore
    const serializedId = await store.auth.serializeUser(user);
    done(null, serializedId);
  } catch (e) {
    done(e);
  }
});

Passport.deserializeUser(async (user_id, done) => {
  try {
    // @ts-ignore
    const user = await store.auth.deserializeUser(user_id);
    if (user) {
      done(null, user);
    } else {
      done(false);
    }
  } catch (e) {
    done(e);
  }
});

export function useAuth(app: Express) {
  app.use(
    expressSession({
      secret: SESSION_SECRET,
      genid: (_req) => {
        return uuidv4();
      },
    })
  );
  app.use(Passport.initialize());
  app.use(Passport.session());

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.send({ message: 'fail' });
      }

      req.login(user, (err) => {
        if (err) {
          console.warn(`login error:\n${err}`);
          return next(err);
        }
        return res.send({ message: 'login success' });
      });
    })(req, res, next);
  });

  app.post('/api/logout', async (req, _res, next) => {
    if (req.user) {
      await store.auth.removeSession(req.user);
      req.logout();
      next('logged out');
    } else {
      next("wasn't logged in");
    }
  });

  app.post('/api/signup', async (req, res, next) => {
    const { username, password, email, age } = req.body;

    if (!usernameLengthValid(username)) {
      return res.json({ error: 'username length boo' });
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

    store.auth
      .getUserByUsername(username)
      .then(async (user) => {
        if (user === false) {
          bcrypt
            .hash(password, 10)
            .then((passwordHashed) => {
              const userModel: UserModel = {
                user_id: uuidv4(),
                username,
                password: passwordHashed,
                email,
                age,
              };
              store.auth.insertUser(userModel).then(() => {
                console.log('user inserted');
                req.login(userModel, (err) => {
                  if (err) {
                    return next(err);
                  }

                  return res.json({ message: 'logged in' });
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

/**
 * Data that is expected from the user for the sign up
 */
interface SignupUserSupplied {
  username: string;
  password: string;
  email: string;
  age: number;
}
