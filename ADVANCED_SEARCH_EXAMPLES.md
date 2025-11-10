# Advanced Search and Filtering Examples

This document provides examples of using the advanced search and filtering capabilities of the GET /products endpoint.

## Available Query Parameters

### Pagination
- `page` - Page number (default: 1, min: 1)
- `pageSize` - Items per page (default: 10, min: 1, max: 100)

### Search
- `search` - Search in product name AND description (case-insensitive)

### Filters
- `category` - Filter by category (case-insensitive, exact match)
- `minPrice` - Minimum price (inclusive)
- `maxPrice` - Maximum price (inclusive)
- `inStock` - Filter by stock availability (true/false)

### Sorting
- `sortBy` - Sort field: `name`, `price`, `stock`, `createdAt`, `category` (default: `createdAt`)
- `sortOrder` - Sort direction: `asc` or `desc` (default: `desc`)

## Usage Examples

### 1. Basic Search
Search for products with "laptop" in name or description:
```
GET /products?search=laptop
```

### 2. Filter by Category
Get all products in the "Electronics" category:
```
GET /products?category=Electronics
```

### 3. Price Range Filter
Get products between $100 and $500:
```
GET /products?minPrice=100&maxPrice=500
```

### 4. In-Stock Products Only
Get only products that are in stock:
```
GET /products?inStock=true
```

### 5. Out-of-Stock Products
Get only products that are out of stock:
```
GET /products?inStock=false
```

### 6. Sort by Price (Ascending)
Get products sorted by price from lowest to highest:
```
GET /products?sortBy=price&sortOrder=asc
```

### 7. Sort by Name (Descending)
Get products sorted by name Z to A:
```
GET /products?sortBy=name&sortOrder=desc
```

### 8. Sort by Creation Date (Newest First)
Get newest products first:
```
GET /products?sortBy=createdAt&sortOrder=desc
```

### 9. Combined Filters - Electronics Under $1000 In Stock
```
GET /products?category=Electronics&maxPrice=1000&inStock=true&sortBy=price&sortOrder=asc
```

### 10. Search with Price Range
Search for "gaming" products between $500 and $2000:
```
GET /products?search=gaming&minPrice=500&maxPrice=2000
```

### 11. Category with Pagination
Get page 2 of Electronics with 20 items per page:
```
GET /products?category=Electronics&page=2&pageSize=20
```

### 12. Advanced Multi-Filter
Electronics in stock, price $100-$500, sorted by price ascending:
```
GET /products?category=Electronics&minPrice=100&maxPrice=500&inStock=true&sortBy=price&sortOrder=asc
```

## Response Format

All requests return a paginated response:

```json
{
  "success": true,
  "message": "Products retrieved with filters (category: \"Electronics\", minPrice: 100, maxPrice: 500, inStock: true)",
  "object": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": 299.99,
      "stock": 50,
      "category": "Electronics",
      "images": ["https://cloudinary.com/..."],
      "createdAt": "2025-11-10T...",
      "updatedAt": "2025-11-10T..."
    }
  ],
  "pageNumber": 1,
  "pageSize": 10,
  "totalSize": 25
}
```

## Validation Rules

1. **Page Number**: Must be ≥ 1
2. **Page Size**: Must be between 1 and 100
3. **Sort By**: Must be one of: name, price, stock, createdAt, category
4. **Price Range**: 
   - minPrice and maxPrice must be ≥ 0
   - minPrice cannot be greater than maxPrice
5. **In Stock**: Must be boolean (true/false)

## Error Responses

### Invalid Sort Field
```json
{
  "success": false,
  "message": "Invalid sort field",
  "errors": ["Sort field must be one of: name, price, stock, createdAt, category"]
}
```

### Invalid Price Range
```json
{
  "success": false,
  "message": "Invalid price range",
  "errors": ["Minimum price cannot be greater than maximum price"]
}
```

## Tips for Best Results

1. **Search is Powerful**: The search parameter looks in both name AND description fields
2. **Combine Filters**: You can combine any filters together for precise results
3. **Case-Insensitive**: Search and category filters are case-insensitive
4. **Caching**: Results are cached for 5 minutes for better performance
5. **Pagination**: Use pagination for large result sets to improve performance

## Common Use Cases

### E-commerce Product Listing
```
GET /products?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc
```

### Category Browse with Sort
```
GET /products?category=Electronics&sortBy=price&sortOrder=asc&page=1&pageSize=12
```

### Search with Filters
```
GET /products?search=wireless&category=Electronics&inStock=true&sortBy=price&sortOrder=asc
```

### Price Range Shopping
```
GET /products?minPrice=0&maxPrice=100&inStock=true&sortBy=price&sortOrder=asc
```

### Budget-Friendly Products
```
GET /products?maxPrice=50&inStock=true&sortBy=price&sortOrder=asc
```
