import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

export const sanitize = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeString = (value: any) => {
    if (typeof value === 'string') {
      return sanitizeHtml(value.trim(), { allowedTags: [], allowedAttributes: {} });
    }
    return value;
  };

  req.body = Object.keys(req.body).reduce((acc, key) => {
    acc[key] = sanitizeString(req.body[key]);
    return acc;
  }, {});

  next();
};