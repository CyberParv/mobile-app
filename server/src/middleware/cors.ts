import cors from 'cors';

export const corsMiddleware = cors({
  origin: process.env.CORS_ORIGINS?.split(',') || [],
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  exposedHeaders: ['X-Request-Id'],
});