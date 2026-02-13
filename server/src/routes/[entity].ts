import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ownershipMiddleware } from '../middleware/ownership';
import { validate } from '../middleware/validate';
import { prisma } from '../lib/prisma';

const router = Router();

// Example entity route
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const entities = await prisma.entity.findMany({ where: { userId: req.user?.id } });
  res.json({ success: true, data: entities });
}));

router.post('/', authMiddleware, validate({ body: { name: 'required|min:2|max:100' } }), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.create({ data: { ...req.body, userId: req.user?.id } });
  res.status(201).json({ success: true, data: entity });
}));

router.get('/:id', authMiddleware, ownershipMiddleware('entity'), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.findUnique({ where: { id: req.params.id } });
  res.json({ success: true, data: entity });
}));

router.put('/:id', authMiddleware, ownershipMiddleware('entity'), validate({ body: { name: 'required|min:2|max:100' } }), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: entity });
}));

router.delete('/:id', authMiddleware, ownershipMiddleware('entity'), asyncHandler(async (req, res) => {
  await prisma.entity.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: null });
}));

export default router;