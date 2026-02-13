import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  req.headers['X-Request-Id'] = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};