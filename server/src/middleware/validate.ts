import { Request, Response, NextFunction } from 'express';

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: errors.array() },
      });
    } catch (error) {
      next(error);
    }
  };
};