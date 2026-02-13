import express from 'express';
import dotenv from 'dotenv';
import { requestId } from './middleware/requestId';
import { securityHeaders } from './middleware/helmet';
import { corsConfig } from './middleware/cors';
import { authLimiter, apiLimiter, strictLimiter } from './middleware/rateLimiter';
import { sanitize } from './middleware/sanitize';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

app.use(express.json());
app.use(requestId);
app.use(securityHeaders);
app.use(corsConfig);
app.use(sanitize);

app.use('/auth', authRoutes);

app.get('/health', (req, res) => res.json({ success: true, message: 'Server is healthy' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));