import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { generateTokens } from '../utils/jwt';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/signup', authLimiter, validate({ body: { email: 'required|email', password: 'required|min:8', name: 'required|min:2|max:100' } }), asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ success: false, error: { code: 'EMAIL_TAKEN', message: 'Email is already taken' } });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, password: hashedPassword, name } });

  const tokens = generateTokens(user.id);

  await prisma.refreshToken.create({ data: { token: tokens.refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });

  res.status(201).json({ success: true, data: { user, tokens } });
}));

router.post('/login', authLimiter, validate({ body: { email: 'required|email', password: 'required|min:8' } }), asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  }

  const tokens = generateTokens(user.id);

  await prisma.refreshToken.create({ data: { token: tokens.refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });

  res.json({ success: true, data: { user, tokens } });
}));

router.post('/refresh', validate({ body: { refreshToken: 'required' } }), asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;

  const storedToken = await prisma.refreshToken.findFirst({ where: { token: refreshToken, userId: decoded.sub } });

  if (!storedToken || storedToken.revokedAt) {
    return res.status(401).json({ success: false, error: { code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid or revoked' } });
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.sub } });

  if (!user) {
    return res.status(401).json({ success: false, error: { code: 'AUTH_USER_NOT_FOUND', message: 'User not found' } });
  }

  const tokens = generateTokens(user.id);

  await prisma.refreshToken.update({ where: { id: storedToken.id }, data: { revokedAt: new Date() } });
  await prisma.refreshToken.create({ data: { token: tokens.refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });

  res.json({ success: true, data: { tokens } });
}));

router.post('/logout', auth, asyncHandler(async (req, res) => {
  await prisma.refreshToken.updateMany({ where: { userId: req.user!.id }, data: { revokedAt: new Date() } });
  res.json({ success: true, message: 'Logged out successfully' });
}));

router.get('/me', auth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

  if (!user) {
    return res.status(401).json({ success: false, error: { code: 'AUTH_USER_NOT_FOUND', message: 'User not found' } });
  }

  res.json({ success: true, data: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt, updatedAt: user.updatedAt } });
}));

export default router;