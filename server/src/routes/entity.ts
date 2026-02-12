import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { ownership } from '../middleware/ownership';
import { asyncHandler } from '../utils/asyncHandler';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', apiLimiter, asyncHandler(async (req, res) => {
  const { cursor, limit } = req.query;
  const entities = await prisma.entity.findMany({
    where: { userId: req.user.id },
    take: limit ? parseInt(limit as string, 10) : 10,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor as string } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  const nextCursor = entities.length > 0 ? entities[entities.length - 1].id : null;
  res.json({ success: true, data: entities, meta: { nextCursor, hasMore: !!nextCursor } });
}));

router.get('/:id', ownership('entity'), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.findUnique({ where: { id: req.params.id } });
  res.json({ success: true, data: entity });
}));

router.post('/', validate({
  name: 'required|min:2|max:100'
}), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.create({ data: { ...req.body, userId: req.user.id } });
  res.status(201).json({ success: true, data: entity });
}));

router.put('/:id', ownership('entity'), validate({
  name: 'required|min:2|max:100'
}), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: entity });
}));

router.delete('/:id', ownership('entity'), asyncHandler(async (req, res) => {
  await prisma.entity.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}));

export default router;