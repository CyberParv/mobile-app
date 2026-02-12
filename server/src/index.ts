import express from 'express';
import { requestId } from './middleware/requestId';
import { helmetMiddleware } from './middleware/helmet';
import { corsMiddleware } from './middleware/cors';
import { sanitize } from './middleware/sanitize';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import entityRoutes from './routes/entity';
import { auth } from './middleware/auth';

const app = express();

app.use(requestId);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(sanitize);

app.use('/auth', authRoutes);
app.use('/entity', auth, entityRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));