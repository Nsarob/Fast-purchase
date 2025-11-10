import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { placeOrder, getOrderHistory } from '../controllers/orderController';

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Place a new order
 *     description: Create a new order with multiple products (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - productId
 *                 - quantity
 *               properties:
 *                 productId:
 *                   type: string
 *                   format: uuid
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 quantity:
 *                   type: integer
 *                   minimum: 1
 *                   example: 2
 *           example:
 *             - productId: "123e4567-e89b-12d3-a456-426614174000"
 *               quantity: 2
 *             - productId: "987fcdeb-51a2-43f7-b890-123456789abc"
 *               quantity: 1
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post('/', authenticate, placeOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get order history
 *     description: Retrieve all orders for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     totalOrders:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getOrderHistory);

export default router;
