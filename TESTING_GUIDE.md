# Test Suite

This project includes comprehensive unit tests for all HTTP endpoints using Jest and Supertest with mocked database connections.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

### Authentication Tests (`auth.test.ts`)
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Missing required fields
- ✅ Login field validation

### Product Tests (`product.test.ts`)
- ✅ Authorization checks (admin vs user vs public)
- ✅ Authentication requirements
- ✅ Product data validation
- ✅ Pagination handling
- ✅ Search parameter support
- ✅ Non-existent product handling

### Order Tests (`order.test.ts`)
- ✅ Empty order array validation
- ✅ Invalid quantity validation
- ✅ Missing product ID validation
- ✅ Authentication requirements
- ✅ Order history retrieval

## Test Structure

All tests use:
- **Jest** as the test framework
- **Supertest** for HTTP assertion testing
- **Mocked database** connections to avoid real database dependencies
- **JWT tokens** generated on the fly for authentication tests

## Test Files Location

```
src/
└── __tests__/
    └── controllers/
        ├── auth.test.ts      # Authentication endpoint tests
        ├── product.test.ts   # Product CRUD endpoint tests
        └── order.test.ts     # Order management endpoint tests
```

## Notes

- All tests mock the database connection to ensure tests run independently
- Tests focus on input validation, authorization, and response format
- Each test suite clears mocks between tests to ensure isolation
