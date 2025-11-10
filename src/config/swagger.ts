import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fast Purchase E-commerce API',
      version: '1.0.0',
      description: `
        A comprehensive REST API for an e-commerce platform with product management, user authentication, and order processing.
        
        ## Features
        - User authentication with JWT
        - Role-based access control (Admin/User)
        - Product CRUD operations with caching
        - Order management with transaction handling
        - Pagination and search functionality
        
        ## Authentication
        Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
        \`\`\`
        Authorization: Bearer <your_jwt_token>
        \`\`\`
      `,
      contact: {
        name: 'Fast Purchase API Support',
        email: 'support@fastpurchase.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.fastpurchase.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', format: 'float' },
            stock: { type: 'integer' },
            category: { type: 'string' },
            userId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            orderId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            totalPrice: { type: 'number', format: 'float' },
            status: { type: 'string', enum: ['pending', 'completed', 'cancelled'] },
            createdAt: { type: 'string', format: 'date-time' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string', format: 'uuid' },
                  productName: { type: 'string' },
                  quantity: { type: 'integer' },
                  price: { type: 'number', format: 'float' },
                  itemTotal: { type: 'number', format: 'float' },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Orders',
        description: 'Order processing endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
