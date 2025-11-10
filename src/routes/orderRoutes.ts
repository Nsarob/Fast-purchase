import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { placeOrder } from '../controllers/orderController';

const router = Router();

// Place order (User only)
router.post('/', authenticate, placeOrder);

export default router;
