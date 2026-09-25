import { Router } from 'express';
import { getExchanges, completeExchange } from '../controllers/exchangeController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', getExchanges);
router.put('/:id/complete', completeExchange);

export default router;
