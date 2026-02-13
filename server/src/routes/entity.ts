import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { auth } from '../middleware/auth';
import { checkOwnership } from '../middleware/ownership';
import { validate } from '../middleware/validate';
import { prisma } from '../lib/prisma';

const router = Router();

router.use(auth);

router.get('/', asyncHandler(async (req, res) => {
  const entities = await prisma.entity.findMany({ where: { userId: req.user!.id } });
  res.json({ success: true, data: entities });
}));

router.post('/', validate({ body: { name: 'required|min:2|max:100' } }), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.create({ data: { ...req.body, userId: req.user!.id } });
  res.status(201).json({ success: true, data: entity });
}));

router.get('/:id', checkOwnership('entity'), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.findUnique({ where: { id: req.params.id } });
  res.json({ success: true, data: entity });
}));

router.put('/:id', checkOwnership('entity'), validate({ body: { name: 'required|min:2|max:100' } }), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: entity });
}));

router.delete('/:id', checkOwnership('entity'), asyncHandler(async (req, res) => {
  await prisma.entity.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: { message: 'Entity deleted' } });
}));

export default router;