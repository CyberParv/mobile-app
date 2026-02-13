import { Request, Response, NextFunction } from 'express';

export const sanitize = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeString = (value: string) => {
    return value.replace(/<[^>]*>?/gm, '').trim().slice(0, 10000);
  };

  const sanitizeObject = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);

  next();
};