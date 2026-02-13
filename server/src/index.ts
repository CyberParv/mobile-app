import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import { helmetMiddleware } from './middleware/helmet';
import { corsMiddleware } from './middleware/cors';
import { authLimiter, apiLimiter, strictLimiter } from './middleware/rateLimiter';
import { sanitizeMiddleware } from './middleware/sanitize';
import { requestIdMiddleware } from './middleware/requestId';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import entityRoutes from './routes/[entity]';

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(sanitizeMiddleware);
app.use(express.json());
app.use(requestIdMiddleware);
app.use(morgan('combined'));

app.use('/auth', authRoutes);
app.use('/entity', authMiddleware, entityRoutes);

app.get('/health', (req, res) => res.json({ success: true, data: 'Healthy' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));