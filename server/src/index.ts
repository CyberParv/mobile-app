import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import prisma from './lib/prisma';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/auth';
import './types/express';
import dotenv from 'dotenv';
import { shutdownHandler } from './utils/shutdownHandler';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: true,
  legacyHeaders: false,
});

const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute) for auth
});

app.use('/auth', authRateLimiter, authRoutes);

app.use(authMiddleware);

app.use(generalRateLimiter);

// Other routes would be mounted here

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => shutdownHandler(server, prisma));
process.on('SIGINT', () => shutdownHandler(server, prisma));
