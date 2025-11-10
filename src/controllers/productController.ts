import { Response, Request } from 'express';
import pool from '../config/database';
import { createResponse, createPaginatedResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { clearResourceCache } from '../middleware/cache';

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

    // Clear product cache when a new product is created
    clearResourceCache('products');

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

    // Clear product cache when a product is updated
    clearResourceCache('products');

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

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const searchQuery = (req.query.search as string) || '';

    // Validate pagination parameters
    if (page < 1) {
      res.status(400).json(
        createResponse(false, 'Invalid page number', undefined, [
          'Page number must be greater than 0',
        ])
      );
      return;
    }

    if (pageSize < 1 || pageSize > 100) {
      res.status(400).json(
        createResponse(false, 'Invalid page size', undefined, [
          'Page size must be between 1 and 100',
        ])
      );
      return;
    }

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Build query based on search parameter
    let countQuery = 'SELECT COUNT(*) FROM products';
    let productsQuery = `SELECT id, name, description, price, stock, category, created_at, updated_at 
       FROM products`;
    const queryParams: any[] = [];

    // Add search filter if search query is provided
    if (searchQuery) {
      countQuery += ' WHERE LOWER(name) LIKE LOWER($1)';
      productsQuery += ' WHERE LOWER(name) LIKE LOWER($1)';
      queryParams.push(`%${searchQuery}%`);
    }

    // Get total count of products (filtered or all)
    const countResult = await pool.query(countQuery, searchQuery ? queryParams : []);
    const totalProducts = parseInt(countResult.rows[0].count);

    // Add ordering and pagination
    productsQuery += ' ORDER BY created_at DESC LIMIT $' + (searchQuery ? '2' : '1') + 
                      ' OFFSET $' + (searchQuery ? '3' : '2');
    
    if (searchQuery) {
      queryParams.push(pageSize, offset);
    } else {
      queryParams.push(pageSize, offset);
    }

    // Get products for current page
    const productsResult = await pool.query(productsQuery, queryParams);

    // Format products
    const products = productsResult.rows.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stock: product.stock,
      category: product.category,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }));

    res.status(200).json(
      createPaginatedResponse(
        true,
        searchQuery 
          ? `Products matching "${searchQuery}" retrieved successfully`
          : 'Products retrieved successfully',
        products,
        page,
        pageSize,
        totalProducts
      )
    );
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error', undefined, [
        'An error occurred while retrieving products',
      ])
    );
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Get product by ID
    const result = await pool.query(
      `SELECT id, name, description, price, stock, category, user_id, created_at, updated_at 
       FROM products 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json(
        createResponse(false, 'Product not found', undefined, [
          'No product found with the specified ID',
        ])
      );
      return;
    }

    const product = result.rows[0];

    res.status(200).json(
      createResponse(true, 'Product retrieved successfully', {
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
    console.error('Get product by ID error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error', undefined, [
        'An error occurred while retrieving the product',
      ])
    );
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if product exists
    const checkProduct = await pool.query('SELECT id, name FROM products WHERE id = $1', [id]);

    if (checkProduct.rows.length === 0) {
      res.status(404).json(
        createResponse(false, 'Product not found', undefined, [
          'No product found with the specified ID',
        ])
      );
      return;
    }

    const productName = checkProduct.rows[0].name;

    // Delete product
    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    // Clear product cache when a product is deleted
    clearResourceCache('products');

    res.status(200).json(
      createResponse(true, 'Product deleted successfully', {
        id,
        name: productName,
        message: `Product "${productName}" has been permanently deleted`,
      })
    );
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error', undefined, [
        'An error occurred while deleting the product',
      ])
    );
  }
};
