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

describe('Order Controller', () => {
  const userToken = generateToken('user-id', 'testuser', 'user');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('should return 400 for empty order array', async () => {
      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send([]);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain(
        'Request body must be an array of products with productId and quantity'
      );
    });

    it('should return 400 for invalid quantity', async () => {
      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send([{ productId: 'product-1', quantity: -5 }]);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain(
        'Quantity must be a positive integer'
      );
    });

    it('should return 400 for missing productId', async () => {
      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send([{ quantity: 5 }]);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/orders')
        .send([{ productId: 'product-1', quantity: 1 }]);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /orders', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/orders');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should accept authenticated requests', async () => {
      const mockQuery = pool.query as jest.Mock;
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
