# Fast Purchase - E-commerce Backend API

> A production-ready REST API for e-commerce platform with advanced features including authentication, product management, image uploads, caching, and comprehensive security.

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## � Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Bonus Features](#-bonus-features)

---

## ✨ Features

### Core Functionality

- 🔐 **JWT Authentication** - Secure signup/login with role-based access control
- 📦 **Product Management** - Full CRUD operations with image upload support
- 🛒 **Order Processing** - Transaction-safe order placement with stock management
- 🔍 **Advanced Search** - Multi-field search, filtering, and sorting
- 📄 **Pagination** - Efficient data retrieval with customizable page sizes

### Advanced Features (All 6 Bonus Points Implemented)

- ✅ **Unit Testing** - 23 comprehensive tests with Jest & Supertest
- ✅ **Caching** - Redis-like caching with automatic invalidation (5-min TTL)
- ✅ **API Documentation** - Interactive Swagger/OpenAPI docs at `/api-docs`
- ✅ **Image Upload** - Cloudinary integration with automatic optimization
- ✅ **Advanced Filtering** - Category, price range, stock availability filters
- ✅ **Rate Limiting** - Protection against brute force and DDoS attacks

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ | PostgreSQL 12+ | npm/yarn

### Installation

```bash
# 1. Clone and install
git clone https://github.com/Nsarob/Fast-purchase.git
cd Fast-purchase
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database and JWT credentials

# 3. Setup database
psql -U postgres -c "CREATE DATABASE fast_purchase;"

# 4. Run the server
npm run dev

# Server runs at http://localhost:3000
# API docs at http://localhost:3000/api-docs
```

### Environment Variables

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fast_purchase
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
CLOUDINARY_URL=cloudinary://your_cloudinary_credentials
```

---

## 📚 API Documentation

### Interactive Documentation

Visit **http://localhost:3000/api-docs** for full Swagger UI with:

- Live API testing
- Request/response schemas
- Authentication flows
- Example requests

### Quick Reference

#### Authentication

```http
POST /auth/register    # Create new user account
POST /auth/login       # Get JWT token
```

#### Products

```http
GET    /products           # List products (supports filtering, sorting, search)
GET    /products/:id       # Get product details
POST   /products           # Create product (Admin only, supports image upload)
PUT    /products/:id       # Update product (Admin only)
DELETE /products/:id       # Delete product (Admin only)
```

#### Orders

```http
POST /orders      # Place order (Authenticated)
GET  /orders      # Get order history (Authenticated)
```

**📖 Detailed Examples**: See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

---

## 🧪 Testing

### Run Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

**Test Coverage**: 23 tests covering authentication, products, orders, and error handling

**📖 Testing Guide**: See [TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)

---

## 📁 Project Structure

```
Fast-purchase/
├── src/
│   ├── config/           # Database, Cloudinary, Multer, Swagger configs
│   ├── controllers/      # Business logic (auth, products, orders)
│   ├── middleware/       # Auth, caching, rate limiting
│   ├── routes/          # API route definitions
│   ├── utils/           # Image upload, validation, response helpers
│   ├── migrations/      # Database migrations
│   ├── app.ts          # Express app configuration
│   └── server.ts       # Server entry point
├── tests/              # Unit and integration tests
├── docs/              # Additional documentation
│   ├── API_DOCUMENTATION.md
│   ├── ADVANCED_SEARCH_EXAMPLES.md
│   ├── CACHING_GUIDE.md
│   └── TESTING_GUIDE.md
└── README.md
```

---

## �️ Tech Stack

| Category           | Technologies               |
| ------------------ | -------------------------- |
| **Runtime**        | Node.js, TypeScript        |
| **Framework**      | Express.js                 |
| **Database**       | PostgreSQL                 |
| **Authentication** | JWT, Bcrypt                |
| **File Upload**    | Multer, Cloudinary         |
| **Caching**        | node-cache                 |
| **Testing**        | Jest, Supertest            |
| **Documentation**  | Swagger/OpenAPI            |
| **Security**       | express-rate-limit, Helmet |
| **Validation**     | Custom validators          |

---

## 🎯 Bonus Features

### ✅ 1. Unit Testing

- **Framework**: Jest + Supertest
- **Coverage**: 23 comprehensive tests
- **Features**: Mocked database, isolated tests, CI/CD ready
- **Details**: [TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)

### ✅ 2. Caching

- **Implementation**: node-cache with 5-minute TTL
- **Strategy**: Automatic invalidation on mutations
- **Endpoints**: All GET requests cached
- **Details**: [CACHING_GUIDE.md](./docs/CACHING_GUIDE.md)

### ✅ 3. API Documentation

- **Tool**: Swagger/OpenAPI 3.0
- **Features**: Interactive UI, request/response examples, authentication testing
- **Access**: http://localhost:3000/api-docs
- **Details**: [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

### ✅ 4. Image Upload

- **Service**: Cloudinary integration
- **Features**: Multi-image upload (max 5), automatic optimization (800x800), format conversion
- **Supported**: JPEG, PNG, GIF, WebP (5MB max)
- **Storage**: Secure URLs in PostgreSQL array

### ✅ 5. Advanced Search & Filtering

- **Search**: Name + Description (case-insensitive)
- **Filters**: Category, price range (min/max), stock availability
- **Sorting**: By name, price, stock, date, category (asc/desc)
- **Details**: [ADVANCED_SEARCH_EXAMPLES.md](./docs/ADVANCED_SEARCH_EXAMPLES.md)

### ✅ 6. Rate Limiting

- **Protection**: Brute force, DDoS, API abuse
- **Limits**:
  - Auth: 5 req/15min
  - Read: 200 req/15min
  - Create: 10 req/15min
  - Orders: 20 req/15min
- **Headers**: RateLimit-\* headers included

---

## � Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/User)
- ✅ Rate limiting per endpoint
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation and sanitization
- ✅ Environment variable protection

---

## � User Stories Implementation

| #   | User Story                    | Status |
| --- | ----------------------------- | ------ |
| 1   | User Signup                   | ✅     |
| 2   | User Login                    | ✅     |
| 3   | Create Product (Admin)        | ✅     |
| 4   | Update Product (Admin)        | ✅     |
| 5   | List Products with Pagination | ✅     |
| 6   | Search Products               | ✅     |
| 7   | Get Product Details           | ✅     |
| 8   | Delete Product (Admin)        | ✅     |
| 9   | Place Order                   | ✅     |
| 10  | View Order History            | ✅     |

**All 10 core user stories + 6 bonus features = 100% complete**

---

## 📖 Additional Documentation

- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Detailed endpoint descriptions
- **[Advanced Search Examples](./docs/ADVANCED_SEARCH_EXAMPLES.md)** - Filtering and sorting usage
- **[Caching Guide](./docs/CACHING_GUIDE.md)** - Cache strategy and implementation
- **[Testing Guide](./docs/TESTING_GUIDE.md)** - How to run and write tests

---

## 👨‍💻 Author

**Nsarob** - [GitHub](https://github.com/Nsarob)

Built as part of **A2SV Backend Engineering Track**

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- A2SV Backend Engineering Team
- Node.js & Express.js communities
- PostgreSQL & TypeScript ecosystems
