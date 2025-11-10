import request from 'supertest';
import app from '../../app';
import pool from '../../config/database';
import jwt from 'jsonwebtoken';

jest.mock('../../config/database', () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));

const generateToken = (userId: string, username: string, role: string) => {
  return jwt.sign(
    { userId, username, role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '24h' }
  );
};

describe('Product Controller', () => {
  const adminToken = generateToken('admin-id', 'admin', 'admin');
  const userToken = generateToken('user-id', 'testuser', 'user');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /products', () => {
    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          stock: 10,
          category: 'Electronics',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).post('/products').send({
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid product data', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '',
          price: -10,
          stock: -5,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /products', () => {
    it('should accept requests without authentication', async () => {
      const mockQuery = pool.query as jest.Mock;
      mockQuery
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should handle pagination parameters', async () => {
      const mockQuery = pool.query as jest.Mock;
      mockQuery
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/products?page=1&pageSize=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should handle search parameter', async () => {
      const mockQuery = pool.query as jest.Mock;
      mockQuery
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/products?search=laptop');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /products/:id', () => {
    it('should return 404 for non-existent product', async () => {
      const mockQuery = pool.query as jest.Mock;
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/products/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /products/:id', () => {
    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .put('/products/product-id')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Product' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/products/product-id')
        .send({ name: 'Updated Product' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .delete('/products/product-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent product', async () => {
      const mockQuery = pool.query as jest.Mock;
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .delete('/products/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).delete('/products/product-id');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
