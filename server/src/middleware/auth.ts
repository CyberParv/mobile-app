import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, error: { code: 'AUTH_TOKEN_INVALID', message: 'Token missing' } });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });

    if (!user || user.disabled) return res.status(401).json({ success: false, error: { code: 'AUTH_USER_NOT_FOUND', message: 'User not found' } });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: { code: 'AUTH_TOKEN_INVALID', message: 'Invalid token' } });
  }
};