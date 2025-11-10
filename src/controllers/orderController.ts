import { Response } from 'express';
import pool from '../config/database';
import { createResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

interface OrderItem {
  productId: string;
  quantity: number;
}

export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    const userId = req.user?.userId;
    const products: OrderItem[] = req.body;

    // Validate request body
    if (!Array.isArray(products) || products.length === 0) {
      res.status(400).json(
        createResponse(false, 'Invalid request', undefined, [
          'Request body must be an array of products with productId and quantity',
        ])
      );
      return;
    }

    // Validate each product item
    for (const item of products) {
      if (!item.productId || !item.quantity) {
        res.status(400).json(
          createResponse(false, 'Invalid product data', undefined, [
            'Each product must have productId and quantity',
          ])
        );
        return;
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        res.status(400).json(
          createResponse(false, 'Invalid quantity', undefined, [
            'Quantity must be a positive integer',
          ])
        );
        return;
      }
    }

    // Start transaction
    await client.query('BEGIN');

    let totalPrice = 0;
    const orderItems: any[] = [];

    // Check stock and calculate total price
    for (const item of products) {
      const productResult = await client.query(
        'SELECT id, name, price, stock FROM products WHERE id = $1',
        [item.productId]
      );

      if (productResult.rows.length === 0) {
        await client.query('ROLLBACK');
        res.status(404).json(
          createResponse(false, 'Product not found', undefined, [
            `Product with ID ${item.productId} does not exist`,
          ])
        );
        return;
      }

      const product = productResult.rows[0];

      // Check if sufficient stock
      if (product.stock < item.quantity) {
        await client.query('ROLLBACK');
        res.status(400).json(
          createResponse(false, 'Insufficient stock', undefined, [
            `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
          ])
        );
        return;
      }

      // Calculate item total
      const itemTotal = parseFloat(product.price) * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: parseFloat(product.price),
        itemTotal,
      });

      // Update product stock
      await client.query(
        'UPDATE products SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [item.quantity, product.id]
      );
    }

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, description, total_price, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, user_id, description, total_price, status, created_at`,
      [userId, `Order with ${products.length} item(s)`, totalPrice, 'pending']
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.productId, item.quantity, item.price]
      );
    }

    // Commit transaction
    await client.query('COMMIT');

    res.status(201).json(
      createResponse(true, 'Order placed successfully', {
        orderId: order.id,
        userId: order.user_id,
        totalPrice: parseFloat(order.total_price),
        status: order.status,
        createdAt: order.created_at,
        items: orderItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          itemTotal: item.itemTotal,
        })),
      })
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Place order error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error', undefined, [
        'An error occurred while placing the order',
      ])
    );
  } finally {
    client.release();
  }
};

export const getOrderHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Get all orders for the user
    const ordersResult = await pool.query(
      `SELECT id, user_id, description, total_price, status, created_at, updated_at 
       FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    if (ordersResult.rows.length === 0) {
      res.status(200).json(
        createResponse(true, 'No orders found', {
          orders: [],
        })
      );
      return;
    }

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name as product_name
           FROM order_items oi
           LEFT JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );

        return {
          orderId: order.id,
          description: order.description,
          totalPrice: parseFloat(order.total_price),
          status: order.status,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: itemsResult.rows.map((item) => ({
            productId: item.product_id,
            productName: item.product_name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            itemTotal: parseFloat(item.price) * item.quantity,
          })),
        };
      })
    );

    res.status(200).json(
      createResponse(true, 'Order history retrieved successfully', {
        orders: ordersWithItems,
        totalOrders: ordersWithItems.length,
      })
    );
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error', undefined, [
        'An error occurred while retrieving order history',
      ])
    );
  }
};
