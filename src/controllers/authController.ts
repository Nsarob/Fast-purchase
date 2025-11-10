import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { createResponse } from '../utils/response';
import { validateEmail, validateUsername, validatePassword } from '../utils/validation';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json(
        createResponse(false, 'All fields are required', undefined, [
          'Username, email, and password are required',
        ])
      );
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      res.status(400).json(
        createResponse(false, 'Validation failed', undefined, [
          'Invalid email address format',
        ])
      );
      return;
    }

    // Validate username format
    if (!validateUsername(username)) {
      res.status(400).json(
        createResponse(false, 'Validation failed', undefined, [
          'Username must be alphanumeric (letters and numbers only, no special characters or spaces)',
        ])
      );
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      res.status(400).json(
        createResponse(false, 'Password validation failed', undefined, passwordValidation.errors)
      );
      return;
    }

    // Check if email already exists
    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      res.status(400).json(
        createResponse(false, 'Registration failed', undefined, [
          'Email is already registered',
        ])
      );
      return;
    }

    // Check if username already exists
    const usernameCheck = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (usernameCheck.rows.length > 0) {
      res.status(400).json(
        createResponse(false, 'Registration failed', undefined, [
          'Username is already taken',
        ])
      );
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const result = await pool.query(
      `INSERT INTO users (username, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role, created_at`,
      [username, email, hashedPassword, 'user']
    );

    const user = result.rows[0];

    res.status(201).json(
      createResponse(true, 'User registered successfully', {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      })
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error', undefined, [
        'An error occurred during registration',
      ])
    );
  }
};
