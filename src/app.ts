import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import express, { NextFunction, Request, Response, RequestHandler } from 'express';
import passport from 'passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import session from 'express-session';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import logger from 'morgan';
import flash from 'connect-flash';
import favicon from 'serve-favicon';
import csrf from 'csurf';
import { TypeormStore } from 'typeorm-store';
import { getConnection } from 'typeorm';
import { getStatusText } from 'http-status-codes';
import { StatusError } from './errors';
import { User } from './entities/User';
import { Session } from './entities/Session';
import { configureHandlebars } from './handlebars-instance';
import { routeConfig } from './routes';
import { requestEntityManager } from './middlewares/entity-manager-middleware';
import { UserRepository } from './repositories/UserRepository';
import { getGeneralConfig, GeneralConfig } from './config';

const config = getGeneralConfig();

function getBrowserEnv(config: GeneralConfig) {
  return {
    CSRF_ENABLED: config.csrfEnabled,
    PORT: config.port,
    NO_TURBOLINKS: config.noTurbolinks,
  };
}

const viewInstance = expressHandlebars.create({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
  handlebars: configureHandlebars(),
});

passport.use(
  new PassportLocalStrategy(
    { usernameField: 'email', session: true },
    (email, password, cb) => {
      getConnection()
        .getCustomRepository(UserRepository)
        .findByEmailAndPassword(email, password)
        .then(user => {
          if (user == null) {
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
  getConnection()
    .getCustomRepository(UserRepository)
    .find(id)
    .then(user => {
      return cb(null, user);
    })
    .catch(cb);
});

let sessionInstance: RequestHandler | undefined;
const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Lazy initialize middleware since it requires an active TypeORM connection
  if (sessionInstance === undefined) {
    sessionInstance = session({
      secret: config.cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
      store: new TypeormStore({
        repository: getConnection().getRepository(Session),
      }),
    });
  }
  return sessionInstance(req, res, next);
};

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';
app.locals.ENV_JSON = JSON.stringify(getBrowserEnv(config));

app.set('port', config.port);

app.use(favicon(path.resolve(__dirname, '../public/favicon.ico')));
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(logger(config.morganPreset));
app.use(cookieParser());

if (config.csrfEnabled) {
  app.use(csrf({ cookie: true }));
}

app.use(flash());
app.use(sessionMiddleware);
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(requestEntityManager());

app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', viewInstance.engine);
app.set('view engine', 'hbs');

if (config.csrfEnabled) {
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });
}

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

for (const { path, router } of routeConfig) {
  app.use(path, router);
}

app.use(
  (_req: Request, _res: Response, next: NextFunction): void => {
    next(new StatusError('Not Found', 404));
  }
);

app.use(
  (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      return next(err);
    }

    const statusCode = err instanceof StatusError ? err.status : 500;

    const env = req.app.get('env');

    res.status(statusCode).render('error', {
      error: ['development', 'test'].includes(env) ? err : {},
      statusCode,
      statusText: getStatusText(statusCode),
    });
  }
);

export default app;
