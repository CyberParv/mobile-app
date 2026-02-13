import cors from 'cors';

const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

export const corsMiddleware = cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  exposedHeaders: ['X-Request-Id']
});