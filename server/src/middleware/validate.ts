import { Request, Response, NextFunction } from 'express';
import { validationResult, checkSchema } from 'express-validator';

export const validate = (schema: any) => {
  return [
    checkSchema(schema),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: errors.mapped() } });
      }
      next();
    },
  ];
};