import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const ownership = (entity: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resource = await prisma[entity].findUnique({ where: { id: req.params.id } });
    if (!resource) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Resource not found' } });
    if (resource.userId !== req.user.id) return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } });
    next();
  };
};