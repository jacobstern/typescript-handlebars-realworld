import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';

export const requestDbConnection = () => (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.dbConnection = getConnection();
  next();
};
