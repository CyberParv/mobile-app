import { Request, Response, NextFunction } from 'express';

export const sanitize = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeString = (value: any) => {
    if (typeof value === 'string') {
      return value.trim().replace(/<[^>]*>?/gm, '').substring(0, 10000);
    }
    return value;
  };

  const sanitizeObject = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      } else {
        obj[key] = sanitizeString(obj[key]);
      }
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);

  next();
};