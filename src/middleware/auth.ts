import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createResponse } from '../utils/response';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(
        createResponse(false, 'Authentication required', undefined, [
          'No token provided',
        ])
      );
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const jwtSecret = process.env.JWT_SECRET || 'default_secret';

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      username: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json(
        createResponse(false, 'Authentication failed', undefined, [
          'Invalid token',
        ])
      );
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json(
        createResponse(false, 'Authentication failed', undefined, [
          'Token expired',
        ])
      );
      return;
    }

    res.status(500).json(
      createResponse(false, 'Internal server error', undefined, [
        'An error occurred during authentication',
      ])
    );
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(
        createResponse(false, 'Authentication required', undefined, [
          'No user information found',
        ])
      );
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json(
        createResponse(false, 'Access denied', undefined, [
          'You do not have permission to access this resource',
        ])
      );
      return;
    }

    next();
  };
};
