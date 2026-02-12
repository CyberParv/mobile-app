import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = Router();

router.post(
  '/signup',
  validate([
    body('email').isEmail().withMessage('Must be a valid email').isLength({ max: 254 }),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ]),
  async (req, res) => {
    const { email, password, displayName, timezone, units, weekStartsOn } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMAIL_ALREADY_EXISTS', message: 'Email already registered' },
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        status: 'pending_verification',
      },
    });

    await prisma.userProfile.create({
      data: {
        userId: user.id,
        displayName,
        timezone,
      },
    });

    await prisma.userSettings.create({
      data: {
        userId: user.id,
        units,
        weekStartsOn,
        biometricUnlockEnabled: false,
        pushNotificationsEnabled: false,
        dataSharingAnalyticsOptIn: false,
      },
    });

    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
        tokens: {
          accessToken,
          accessTokenExpiresInSec: 900,
          refreshToken,
          refreshTokenExpiresInSec: 604800,
        },
      },
    });
  }
);

export default router;
