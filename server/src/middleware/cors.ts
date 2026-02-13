import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowed = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!origin || allowed.includes(origin) || allowed.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id']
});