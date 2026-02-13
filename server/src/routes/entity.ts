import { Router } from 'express';
import { auth } from '../middleware/auth';
import { ownership } from '../middleware/ownership';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', auth, asyncHandler(async (req, res) => {
  // Implement list with pagination
  res.json({ success: true, data: [] });
}));

router.post('/', auth, validate({ body: { name: 'required|min:2|max:100' } }), asyncHandler(async (req, res) => {
  // Implement create
  res.status(201).json({ success: true, data: {} });
}));

router.get('/:id', auth, ownership('entity'), asyncHandler(async (req, res) => {
  // Implement get by ID
  res.json({ success: true, data: {} });
}));

router.put('/:id', auth, ownership('entity'), validate({ body: { name: 'required|min:2|max:100' } }), asyncHandler(async (req, res) => {
  // Implement update
  res.json({ success: true, data: {} });
}));

router.delete('/:id', auth, ownership('entity'), asyncHandler(async (req, res) => {
  // Implement delete
  res.json({ success: true, message: 'Deleted successfully' });
}));

export default router;