import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const errorResponse = { success: false, error: { code: err.code || 'INTERNAL_SERVER_ERROR', message: err.message || 'An unexpected error occurred' } };

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(statusCode).json(errorResponse);
};