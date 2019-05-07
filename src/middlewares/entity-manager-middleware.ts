import { Request, Response, NextFunction } from 'express';
import { getManager } from 'typeorm';

export const requestEntityManager = () => (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.entityManager = getManager();
  next();
};
