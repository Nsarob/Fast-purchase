import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { placeOrder, getOrderHistory } from '../controllers/orderController';

const router = Router();

// Place order (User only)
router.post('/', authenticate, placeOrder);

// Get order history (User only)
router.get('/', authenticate, getOrderHistory);

export default router;
