import request from 'supertest';
import app from '../../app';
import pool from '../../config/database';
import bcrypt from 'bcrypt';

// Mock the database pool
jest.mock('../../config/database', () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should return 400 for invalid email format', async () => {
      const response = await request(app).post('/auth/register').send({
        username: 'testuser',
        email: 'invalid-email',
        password: 'Password123!',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Invalid email address format');
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app).post('/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors[0]).toContain('at least 8 characters');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app).post('/auth/register').send({
        username: 'testuser',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    it('should return 400 for missing fields', async () => {
      const response = await request(app).post('/auth/login').send({
        identifier: 'test@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing identifier', async () => {
      const response = await request(app).post('/auth/login').send({
        password: 'Password123!',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
