import { Router } from 'express';
import { createProduct } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Admin only - Create product
router.post('/', authenticate, authorize('admin'), createProduct);

export default router;
