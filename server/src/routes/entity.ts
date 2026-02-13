import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { auth } from '../middleware/auth';
import { ownership } from '../middleware/ownership';
import { validate } from '../middleware/validate';
import { prisma } from '../lib/prisma';

const router = Router();

router.use(auth);

router.get('/', asyncHandler(async (req, res) => {
  const entities = await prisma.entity.findMany({
    where: { userId: req.user?.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    skip: parseInt(req.query.cursor as string) || 0
  });

  const hasMore = entities.length === 10;
  const cursor = hasMore ? entities[entities.length - 1].id : null;

  res.json({ success: true, data: entities, meta: { cursor, hasMore, total: entities.length } });
}));

router.post('/', validate({
  body: {
    name: 'required|min:2|max:100'
  }
}), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.create({
    data: {
      name: req.body.name,
      userId: req.user?.id
    }
  });

  res.status(201).json({ success: true, data: entity });
}));

router.get('/:id', ownership('entity'), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.findUnique({ where: { id: req.params.id } });

  if (!entity) {
    return res.status(404).json({ success: false, error: { code: 'ENTITY_NOT_FOUND', message: 'Entity not found.' } });
  }

  res.json({ success: true, data: entity });
}));

router.put('/:id', ownership('entity'), validate({
  body: {
    name: 'required|min:2|max:100'
  }
}), asyncHandler(async (req, res) => {
  const entity = await prisma.entity.update({
    where: { id: req.params.id },
    data: { name: req.body.name }
  });

  res.json({ success: true, data: entity });
}));

router.delete('/:id', ownership('entity'), asyncHandler(async (req, res) => {
  await prisma.entity.delete({ where: { id: req.params.id } });

  res.json({ success: true, message: 'Entity deleted successfully.' });
}));

export default router;