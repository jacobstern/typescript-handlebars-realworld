// eslint-disable-next-line
import { Connection } from 'typeorm';

declare global {
  namespace Express {
    interface Request {
      dbConnection: Connection;
    }
  }
}
