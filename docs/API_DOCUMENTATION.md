# API Documentation

This project includes comprehensive API documentation using **Swagger/OpenAPI 3.0**.

## Accessing Documentation

Once the server is running, visit:

```
http://localhost:3000/api-docs
```

## Features

-  **Interactive API Documentation**: Try out API endpoints directly from the browser
-  **Authentication Support**: Test protected endpoints with JWT tokens
-  **Request/Response Examples**: See example requests and responses for each endpoint
-  **Schema Validation**: View request/response schemas and validation rules
-  **Organized by Tags**: Endpoints grouped by Authentication, Products, and Orders

## How to Use

### 1. Browse Endpoints

Navigate through the documented endpoints organized by tags:

- **Authentication**: Register and login endpoints
- **Products**: CRUD operations for products (public + admin)
- **Orders**: Order placement and history retrieval

### 2. Test Authenticated Endpoints

For endpoints that require authentication:

1. First, login using POST `/auth/login` or register using POST `/auth/register`
2. Copy the JWT token from the response
3. Click the **"Authorize"** button at the top of the page
4. Enter: `Bearer <your_token_here>`
5. Click "Authorize" and "Close"
6. Now you can test protected endpoints


## Available Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Products (Public)

- `GET /products` - List all products (with pagination & search)
- `GET /products/:id` - Get product details

### Products (Admin Only)

- `POST /products` - Create a new product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

### Orders (Authenticated Users)

- `POST /orders` - Place a new order
- `GET /orders` - Get order history

## Response Format

All responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

