import Passport from 'passport';
import passportLocal from 'passport-local';
import expressSession from 'express-session';
import store from 'six__server__store';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { isValidEmail, passwordLengthValid } from './validation/single';
import { SESSION_SECRET, SECURE_SCHEMES } from 'six__server__global';
import type { Express, Request, Response, NextFunction } from 'express';
import authRoutes from './auth-routes';

const LocalStrategy = passportLocal.Strategy;

Passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      const errors = [];

      if (!isValidEmail(email)) {
        errors.push('username not within length params');
      }

      if (!passwordLengthValid(password)) {
        errors.push('pass not within length params');
      }

      if (errors.length) {
        return done(errors);
      }

      store.user.selectByEmail(email).then((user: Express.User | false) => {
        if (!user) {
          return done('NO_SUCH_USER', false);
        }

        // @ts-ignore
        bcrypt.compare(password, user.password).then((result) => {
          if (!result) {
            return done('WRONG_USERNAME_OR_PASS', false);
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
  app.use('/api', authRoutes);
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    next();
  }
  // TODO this shall be connected to somewhere more meaningful
  res.redirect('/api/headers');
}

export const passport = Passport;
