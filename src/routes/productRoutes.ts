import { Router } from 'express';
import { createProduct, updateProduct, getProducts } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public - Get all products with pagination
router.get('/', getProducts);

// Admin only - Create product
router.post('/', authenticate, authorize('admin'), createProduct);

// Admin only - Update product
router.put('/:id', authenticate, authorize('admin'), updateProduct);

export default router;
