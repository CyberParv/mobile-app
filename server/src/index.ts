import express from 'express';
import dotenv from 'dotenv';
import { requestId } from './middleware/requestId';
import { helmetMiddleware } from './middleware/helmet';
import { corsMiddleware } from './middleware/cors';
import { authLimiter, apiLimiter, strictLimiter } from './middleware/rateLimiter';
import { sanitize } from './middleware/sanitize';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import entityRoutes from './routes/entity';

dotenv.config();

const app = express();

app.use(express.json());
app.use(requestId);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(sanitize);

app.use('/auth', authRoutes);
app.use('/entity', apiLimiter, entityRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});