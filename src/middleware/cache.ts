import { Request, Response, NextFunction } from 'express';
import cache from '../config/cache';

/**
 * Middleware to cache GET requests
 * @param duration - Cache duration in seconds (default: 300 seconds / 5 minutes)
 */
export const cacheMiddleware = (duration: number = 300) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      next();
      return;
    }

    // Generate cache key from URL and query parameters
    const cacheKey = `__express__${req.originalUrl || req.url}`;

    // Try to get cached response
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      // Send cached response
      res.json(cachedResponse);
      return;
    }

    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (body: any): Response => {
      // Cache the response
      cache.set(cacheKey, body, duration);

      // Call original json function
      return originalJson(body);
    };

    next();
  };
};

/**
 * Clear all cache
 */
export const clearCache = (): void => {
  cache.flushAll();
};

/**
 * Clear specific cache by key pattern
 */
export const clearCacheByPattern = (pattern: string): void => {
  const keys = cache.keys();
  const matchingKeys = keys.filter((key) => key.includes(pattern));
  matchingKeys.forEach((key) => cache.del(key));
};

/**
 * Clear cache for specific resource
 */
export const clearResourceCache = (resource: 'products' | 'orders'): void => {
  clearCacheByPattern(`/${resource}`);
};
