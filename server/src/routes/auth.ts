import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/signup', authLimiter, validate({
  body: {
    email: 'required|email',
    password: 'required|min:8',
    name: 'required|min:2|max:100'
  }
}), asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ success: false, error: { code: 'EMAIL_TAKEN', message: 'Email is already taken.' } });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });

  const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, name: user.name }, tokens: { accessToken, refreshToken } } });
}));

router.post('/login', authLimiter, validate({
  body: {
    email: 'required|email',
    password: 'required|min:8'
  }
}), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } });
  }

  const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  res.json({ success: true, data: { user: { id: user.id, email: user.email, name: user.name }, tokens: { accessToken, refreshToken } } });
}));

router.post('/refresh', validate({
  body: {
    refreshToken: 'required'
  }
}), asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
    const tokenRecord = await prisma.refreshToken.findFirst({ where: { token: refreshToken, userId: decoded.sub } });

    if (!tokenRecord || tokenRecord.revokedAt) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token.' } });
    }

    const newAccessToken = jwt.sign({ sub: decoded.sub }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ sub: decoded.sub }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() }
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.sub,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({ success: true, data: { tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken } } });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, error: { code: 'AUTH_TOKEN_EXPIRED', message: 'Refresh token expired.' } });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, error: { code: 'AUTH_TOKEN_INVALID', message: 'Invalid refresh token.' } });
    }
    throw err;
  }
}));

router.post('/logout', auth, asyncHandler(async (req, res) => {
  await prisma.refreshToken.updateMany({
    where: { userId: req.user?.id },
    data: { revokedAt: new Date() }
  });

  res.json({ success: true, message: 'Logged out successfully.' });
}));

router.get('/me', auth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user?.id } });

  if (!user) {
    return res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found.' } });
  }

  res.json({ success: true, data: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt, updatedAt: user.updatedAt } });
}));

export default router;