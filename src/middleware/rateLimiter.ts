import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * Applies to all API endpoints
 * 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    errors: ['Rate limit exceeded. Please wait before making more requests.'],
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      errors: ['Rate limit exceeded. Please wait before making more requests.'],
    });
  },
});

/**
 * Authentication rate limiter
 * Stricter limits for login/register endpoints to prevent brute force attacks
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register attempts per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    errors: ['Too many login/register attempts. Please wait 15 minutes before trying again.'],
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests, even successful ones
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      errors: ['Too many login/register attempts. Please wait 15 minutes before trying again.'],
    });
  },
});

/**
 * Product creation rate limiter
 * Moderate limits for product creation (admin only)
 * 10 requests per 15 minutes per IP
 */
export const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 product creations per windowMs
  message: {
    success: false,
    message: 'Too many product creation requests, please try again later.',
    errors: ['Rate limit exceeded for product creation. Please wait before creating more products.'],
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many product creation requests, please try again later.',
      errors: ['Rate limit exceeded for product creation. Please wait before creating more products.'],
    });
  },
});

/**
 * Order creation rate limiter
 * Moderate limits for order placement
 * 20 requests per 15 minutes per IP
 */
export const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 order creations per windowMs
  message: {
    success: false,
    message: 'Too many order requests, please try again later.',
    errors: ['Rate limit exceeded for order creation. Please wait before placing more orders.'],
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many order requests, please try again later.',
      errors: ['Rate limit exceeded for order creation. Please wait before placing more orders.'],
    });
  },
});

/**
 * Read-only endpoints rate limiter (GET requests)
 * More lenient limits for read operations
 * 200 requests per 15 minutes per IP
 */
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 read requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    errors: ['Rate limit exceeded for read operations. Please slow down your requests.'],
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
      errors: ['Rate limit exceeded for read operations. Please slow down your requests.'],
    });
  },
});
