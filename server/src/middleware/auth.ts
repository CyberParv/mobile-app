import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: { code: 'AUTH_TOKEN_MISSING', message: 'Authorization token is missing.' } });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as jwt.JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });

    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'AUTH_USER_NOT_FOUND', message: 'User not found.' } });
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, error: { code: 'AUTH_TOKEN_EXPIRED', message: 'Token expired.' } });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, error: { code: 'AUTH_TOKEN_INVALID', message: 'Invalid token.' } });
    }
    next(err);
  }
};