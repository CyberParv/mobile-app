import { Request, Response, NextFunction } from 'express';

export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (value: any) => {
    if (typeof value === 'string') {
      return value.trim().replace(/\0/g, '').replace(/<[^>]*>/g, '').substring(0, 10000);
    }
    return value;
  };

  for (const key in req.body) {
    req.body[key] = sanitize(req.body[key]);
  }

  for (const key in req.query) {
    req.query[key] = sanitize(req.query[key]);
  }

  for (const key in req.params) {
    req.params[key] = sanitize(req.params[key]);
  }

  next();
};