import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import session from 'express-session';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import logger from 'morgan';
import { TypeormStore } from 'typeorm-store';
import { getConnection } from 'typeorm';
import { StatusError } from './errors';
import { findUserByUsername, findUser } from './services/accounts';
import { User } from './entities/User';
import { Session } from './entities/Session';

import homeRoutes from './routes/home';
import registerRoutes from './routes/register';
import settingsRoutes from './routes/settings';

const viewInstance = expressHandlebars.create({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
});

passport.use(
  new PassportLocalStrategy(
    { usernameField: 'email', session: true },
    (username, password, cb) => {
      findUserByUsername(username)
        .then(user => {
          if (user === undefined || !user.checkPassword(password)) {
            return cb(null, false);
          }
          return cb(null, user);
        })
        .catch(cb);
    }
  )
);

passport.serializeUser<User, User['id']>((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser<User, User['id']>((id, cb) => {
  findUser(id)
    .then(user => {
      return cb(null, user);
    })
    .catch(cb);
});

const sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
  store: new TypeormStore({
    repository: getConnection().getRepository(Session),
  }),
});

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', viewInstance.engine);
app.set('view engine', 'hbs');

app.use('/', homeRoutes);
app.use('/home', homeRoutes);
app.use('/register', registerRoutes);
app.use('/settings', settingsRoutes);

app.use(
  (_req: Request, _res: Response, next: NextFunction): void => {
    next(new StatusError('Not Found', 404));
  }
);

// 500 - error handler
app.use(
  (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      return next(err);
    }

    if (err instanceof Error) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
    }

    const status = err instanceof StatusError ? err.status : 500;

    res.status(status).render('error', { user: req.user });
  }
);

export default app;
