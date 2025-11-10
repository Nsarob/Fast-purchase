# Caching Implementation

This project implements in-memory caching for product listing endpoints to improve performance and reduce database load.

## Cache Configuration

- **Cache Library**: `node-cache` (in-memory caching)
- **Default TTL**: 5 minutes (300 seconds)
- **Cache Check Period**: 60 seconds

## Cached Endpoints

### GET /products

- **Cache Duration**: 5 minutes
- **Cache Key**: Based on full URL including query parameters
- **Cache Invalidation**: Automatically cleared when products are created, updated, or deleted

### GET /products/:id

- **Cache Duration**: 5 minutes
- **Cache Key**: Based on product ID
- **Cache Invalidation**: Automatically cleared when any product is modified

## How It Works

1. **First Request**: Data is fetched from the database and stored in cache
2. **Subsequent Requests**: Data is served directly from cache (much faster)
3. **Cache Expiry**: After 5 minutes, data is automatically removed from cache
4. **Cache Invalidation**: When admins create/update/delete products, all product caches are cleared


## Cache Invalidation

Cache is automatically cleared when:

- New product is created (POST /products)
- Product is updated (PUT /products/:id)
- Product is deleted (DELETE /products/:id)

## Example

```bash
# 1 request - fetched from database (slower)
GET /products?page=1&pageSize=10
# Response time: ~100ms

# 2 request within 5 minutes - served from cache (faster)
GET /products?page=1&pageSize=10
# Response time: ~5ms

# After admin creates a product
POST /products
# Cache is cleared for all product endpoints

# Next request - fetched from database again
GET /products?page=1&pageSize=10
# Response time: ~100ms (cache rebuilt)
```

## Technical Implementation

### Cache Middleware (`src/middleware/cache.ts`)

- Intercepts GET requests
- Generates unique cache keys based on URL
- Stores responses automatically
- Serves cached responses when available

### Cache Invalidation (`src/controllers/productController.ts`)

- `clearResourceCache('products')` called after:
  - createProduct
  - updateProduct
  - deleteProduct

## Future Enhancements

- Redis integration for distributed caching
- Cache warming strategies
- Cache statistics and monitoring
- Configurable TTL per endpoint
