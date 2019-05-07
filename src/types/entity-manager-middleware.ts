// eslint-disable-next-line
import { EntityManager } from 'typeorm';

declare global {
  namespace Express {
    interface Request {
      entityManager: EntityManager;
    }
  }
}
