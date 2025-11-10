import { Router } from 'express';
import { createProduct, updateProduct } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Admin only - Create product
router.post('/', authenticate, authorize('admin'), createProduct);

// Admin only - Update product
router.put('/:id', authenticate, authorize('admin'), updateProduct);

export default router;
