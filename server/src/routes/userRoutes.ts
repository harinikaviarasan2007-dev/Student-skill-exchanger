import { Router } from 'express';
import { getUsers, getUserById, updateUser } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', requireAuth, updateUser);

export default router;
