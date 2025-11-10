import { Response } from 'express';
import pool from '../config/database';
import { createResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, category } = req.body;
    const userId = req.user?.userId;

    // Validate required fields
    if (!name || !description || price === undefined || stock === undefined || !category) {
      res.status(400).json(
        createResponse(false, 'All fields are required', undefined, [
          'Name, description, price, stock, and category are required',
        ])
      );
      return;
    }

    // Validate name length
    if (name.length < 3 || name.length > 100) {
      res.status(400).json(
        createResponse(false, 'Validation failed', undefined, [
          'Product name must be between 3 and 100 characters',
        ])
      );
      return;
    }

    // Validate description length
    if (description.length < 10) {
      res.status(400).json(
        createResponse(false, 'Validation failed', undefined, [
          'Product description must be at least 10 characters long',
        ])
      );
      return;
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      res.status(400).json(
        createResponse(false, 'Validation failed', undefined, [
          'Price must be a positive number greater than 0',
        ])
      );
      return;
    }

    // Validate stock
    if (!Number.isInteger(stock) || stock < 0) {
      res.status(400).json(
        createResponse(false, 'Validation failed', undefined, [
          'Stock must be a non-negative integer (0 or more)',
        ])
      );
      return;
    }

    // Insert product into database
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, category, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, description, price, stock, category, user_id, created_at, updated_at`,
      [name, description, price, stock, category, userId]
    );

    const product = result.rows[0];

    res.status(201).json(
      createResponse(true, 'Product created successfully', {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        stock: product.stock,
        category: product.category,
        userId: product.user_id,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      })
    );
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error', undefined, [
        'An error occurred while creating the product',
      ])
    );
  }
};
