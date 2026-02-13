import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { json } from 'body-parser';
import morgan from 'morgan';
import { helmetMiddleware } from './middleware/helmet';
import { corsMiddleware } from './middleware/cors';
import { apiLimiter } from './middleware/rateLimiter';
import { sanitize } from './middleware/sanitize';
import { requestId } from './middleware/requestId';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import entityRoutes from './routes/entity';

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(apiLimiter);
app.use(sanitize);
app.use(json());
app.use(requestId);
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/entity', entityRoutes);

app.use(errorHandler);

app.get('/health', (req, res) => res.json({ success: true, message: 'Healthy' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));