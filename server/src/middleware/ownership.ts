import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const ownership = (entity: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = req.params.id;
    const resource = await prisma[entity].findUnique({ where: { id: resourceId } });

    if (!resource || resource.userId !== req.user?.id) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not have access to this resource.' } });
    }

    next();
  };
};