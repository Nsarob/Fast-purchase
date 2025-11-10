import { Router } from 'express';
import { createProduct, updateProduct, getProducts, getProductById, deleteProduct } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

// Public - Get all products with pagination (cached for 5 minutes)
router.get('/', cacheMiddleware(300), getProducts);

// Public - Get single product by ID (cached for 5 minutes)
router.get('/:id', cacheMiddleware(300), getProductById);

// Admin only - Create product
router.post('/', authenticate, authorize('admin'), createProduct);

// Admin only - Update product
router.put('/:id', authenticate, authorize('admin'), updateProduct);

// Admin only - Delete product
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default router;
