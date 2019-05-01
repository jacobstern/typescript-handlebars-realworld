import compression from 'compression';
import express, { NextFunction, Request, Response } from 'express';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import logger from 'morgan';
import { StatusError } from './errors';

import homeRoutes from './routes/home';
import registerRoutes from './routes/register';

const viewInstance = expressHandlebars.create({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
});

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

app.engine('hbs', viewInstance.engine);
app.set('view engine', 'hbs');

app.use('/', homeRoutes);
app.use('/home', homeRoutes);
app.use('/register', registerRoutes);

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

    res.status(status).render('error');
  }
);

export default app;
