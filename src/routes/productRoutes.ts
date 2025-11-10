import { Router } from 'express';
import { createProduct, updateProduct, getProducts, getProductById, deleteProduct } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public - Get all products with pagination
router.get('/', getProducts);

// Public - Get single product by ID
router.get('/:id', getProductById);

// Admin only - Create product
router.post('/', authenticate, authorize('admin'), createProduct);

// Admin only - Update product
router.put('/:id', authenticate, authorize('admin'), updateProduct);

// Admin only - Delete product
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default router;
