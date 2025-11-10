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

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    // Check if product exists
    const checkProduct = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    
    if (checkProduct.rows.length === 0) {
      res.status(404).json(
        createResponse(false, 'Product not found', undefined, [
          'No product found with the specified ID',
        ])
      );
      return;
    }

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      // Validate name if provided
      if (name.length < 3 || name.length > 100) {
        res.status(400).json(
          createResponse(false, 'Validation failed', undefined, [
            'Product name must be between 3 and 100 characters',
          ])
        );
        return;
      }
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (description !== undefined) {
      // Validate description if provided
      if (description.length < 10) {
        res.status(400).json(
          createResponse(false, 'Validation failed', undefined, [
            'Product description must be at least 10 characters long',
          ])
        );
        return;
      }
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (price !== undefined) {
      // Validate price if provided
      if (typeof price !== 'number' || price <= 0) {
        res.status(400).json(
          createResponse(false, 'Validation failed', undefined, [
            'Price must be a positive number greater than 0',
          ])
        );
        return;
      }
      updates.push(`price = $${paramCount}`);
      values.push(price);
      paramCount++;
    }

    if (stock !== undefined) {
      // Validate stock if provided
      if (!Number.isInteger(stock) || stock < 0) {
        res.status(400).json(
          createResponse(false, 'Validation failed', undefined, [
            'Stock must be a non-negative integer (0 or more)',
          ])
        );
        return;
      }
      updates.push(`stock = $${paramCount}`);
      values.push(stock);
      paramCount++;
    }

    if (category !== undefined) {
      updates.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }

    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add product ID as last parameter
    values.push(id);

    // Execute update query
    const result = await pool.query(
      `UPDATE products 
       SET ${updates.join(', ')} 
       WHERE id = $${paramCount}
       RETURNING id, name, description, price, stock, category, user_id, created_at, updated_at`,
      values
    );

    const product = result.rows[0];

    res.status(200).json(
      createResponse(true, 'Product updated successfully', {
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
    console.error('Update product error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error', undefined, [
        'An error occurred while updating the product',
      ])
    );
  }
};
