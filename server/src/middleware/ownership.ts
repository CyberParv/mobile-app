import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const ownershipMiddleware = (entity: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const resource = await prisma[entity].findUnique({ where: { id } });
    if (!resource || resource.userId !== req.user?.id) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not have access to this resource' } });
    }
    next();
  };
};