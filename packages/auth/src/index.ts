import Passport from 'passport';
import passportLocal from 'passport-local';
import expressSession from 'express-session';
import store from 'six__server__store';
import { SESSION_SECRET } from './config';
import type { Express, Request, Response, NextFunction } from 'express';

const LocalStrategy = passportLocal.Strategy;

Passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await store.auth.loginWithUsernameAndPassword(
          username,
          password
        );
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (e) {
        done(e);
      }
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

Passport.deserializeUser(async (id, done) => {
  try {
    // @ts-ignore
    const user = await store.auth.deserializeUser(id);
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

  app.post('/api/signup', async (req, _res, next) => {
    // TODO
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
