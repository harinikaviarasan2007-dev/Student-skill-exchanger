import { Router } from 'express';
import { createReview, getReviewsForUser } from '../controllers/reviewController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/', requireAuth, createReview);
router.get('/user/:id', getReviewsForUser);

export default router;
