import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { validate } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/signup', authLimiter, validate({
  email: 'required|email',
  password: 'required|min:8',
  name: 'required|min:2|max:100'
}), async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(409).json({ success: false, error: { code: 'EMAIL_TAKEN', message: 'Email already taken' } });

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, password: hashedPassword, name } });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id } });

  res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, name: user.name }, tokens: { accessToken, refreshToken, expiresIn: 900 } } });
});

router.post('/login', authLimiter, validate({
  email: 'required|email',
  password: 'required|min:8'
}), async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id } });

  res.json({ success: true, data: { user: { id: user.id, email: user.email, name: user.name }, tokens: { accessToken, refreshToken, expiresIn: 900 } } });
});

router.post('/refresh', validate({
  refreshToken: 'required'
}), async (req, res) => {
  const { refreshToken } = req.body;

  const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!storedToken || storedToken.revokedAt) return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' } });

  const newAccessToken = generateAccessToken(storedToken.userId);
  const newRefreshToken = generateRefreshToken(storedToken.userId);

  await prisma.refreshToken.update({ where: { token: refreshToken }, data: { revokedAt: new Date() } });
  await prisma.refreshToken.create({ data: { token: newRefreshToken, userId: storedToken.userId } });

  res.json({ success: true, data: { tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn: 900 } } });
});

router.post('/logout', async (req, res) => {
  const userId = req.user.id;
  await prisma.refreshToken.updateMany({ where: { userId }, data: { revokedAt: new Date() } });
  res.json({ success: true });
});

router.get('/me', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, email: true, name: true } });
  res.json({ success: true, data: user });
});

export default router;