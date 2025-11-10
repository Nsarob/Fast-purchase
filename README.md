# Fast Purchase - E-commerce Backend API

A comprehensive REST API for an e-commerce platform built with Node.js, TypeScript, Express, and PostgreSQL.

## 🚀 Features

- User authentication (Signup & Login) with JWT
- Product management (CRUD operations)
- Order processing with transaction support
- Role-based access control (Admin & User)
- Input validation and error handling
- Pagination and search functionality
- PostgreSQL database with proper relations

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Nsarob/Fast-purchase.git
cd Fast-purchase
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fast_purchase
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h
```

4. Create PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE fast_purchase;
\q
```

## 🏃‍♂️ Running the Application

### Development mode (with hot reload):
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Products
- `GET /products` - Get all products (with pagination & search)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

### Orders
- `POST /orders` - Place a new order (Authenticated users)
- `GET /orders` - Get user's order history (Authenticated users)

## 🧪 Testing with Postman

1. Import the Postman collection (coming soon)
2. Set up environment variables:
   - `base_url`: http://localhost:3000
   - `token`: (will be set automatically after login)

## 📁 Project Structure

```
Fast-purchase/
├── src/
│   ├── config/          # Database and configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware (auth, validation)
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── .env.example        # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## 🛡️ Error Handling

The API uses consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## 👥 User Roles

- **User**: Can browse products, place orders, view order history
- **Admin**: Can manage products (create, update, delete) + all User permissions

## 📝 User Stories Implementation

This project implements 10 user stories:
1. ✅ User Signup
2. ✅ User Login
3. ✅ Create Product (Admin)
4. ✅ Update Product (Admin)
5. ✅ List Products with Pagination
6. ✅ Search Products
7. ✅ Get Product Details
8. ✅ Delete Product (Admin)
9. ✅ Place Order
10. ✅ View Order History

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes with meaningful messages
4. Push to your branch
5. Create a Pull Request



## 👨‍💻 Author

Nsarob - [GitHub](https://github.com/Nsarob)

## 🙏 Acknowledgments

Built as part of A2SV Backend Engineering Track
