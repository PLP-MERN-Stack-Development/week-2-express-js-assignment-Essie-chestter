Product API
This is a RESTful API built with Express.js that manages product data. It supports standard CRUD (Create, Read, Update, Delete) operations, includes middleware for logging, authentication, and validation, and features robust error handling. Additionally, it offers advanced functionalities like filtering, pagination, and searching.
Features
 * RESTful CRUD Operations: Full support for creating, reading, updating, and deleting products.
 * Custom Middleware:
   * Logger: Logs request method, URL, and timestamp.
   * Authentication: Checks for a valid API key (x-api-key) in request headers for protected routes.
   * Validation: Ensures product data integrity during creation and update.
 * Comprehensive Error Handling:
   * Global error handling middleware.
   * Custom error classes (NotFoundError, ValidationError, UnauthorizedError) for specific error types.
   * Appropriate HTTP status codes and detailed error messages.
 * Advanced Features:
   * Filtering: Filter products by category using query parameters.
   * Pagination: Limit and offset product listings for efficient data retrieval.
   * Searching: Search products by name using query parameters.
   * Statistics: Get a count of products grouped by category.
Setup and Installation
Before you begin, ensure you have Node.js (v18 or higher recommended) installed on your system.
 * Clone the repository (or set up the files manually):
   If you're getting the project from a repository, clone it:
   git clone <repository-url>
cd <repository-name>

   If you're creating files manually, create a project directory and navigate into it:
   mkdir product-api
cd product-api

   Then, create the following files: server.js, api.routes.js, middleware.js, errorHandling.js, and package.json (as provided in the previous responses).
 * Install dependencies:
   Navigate to your project root directory in the terminal and run:
   npm install

   This will install express, body-parser, and uuid.
How to Run the Server
 * Start the server:
   From your project root directory, execute:
   npm start

   You should see the message: Server is running on http://localhost:3000
 * Access the API:
   Open your web browser or an API client (like Postman, Insomnia, or curl) and navigate to http://localhost:3000.
API Endpoints Documentation
The API uses http://localhost:3000/api as its base URL.
Product Resource (/api/products)
A product object has the following structure:
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "inStock": "boolean"
}

GET /api/products
 * Description: Retrieves a list of all products. Supports filtering, searching, and pagination.
 * Query Parameters:
   * category: Filter products by a specific category (case-insensitive).
   * search: Search products by name (case-insensitive, partial match).
   * page: The page number for pagination (defaults to 1).
   * limit: The number of products per page (defaults to 10).
 * Response:
   * 200 OK
   * Body: application/json array of product objects, or an object with pagination details if page or limit are used.
Examples:
 * Get all products:
   GET http://localhost:3000/api/products

   Response:
   [
  {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  },
  {
    "id": "2",
    "name": "Smartphone",
    "description": "Latest model with 128GB storage",
    "price": 800,
    "category": "electronics",
    "inStock": true
  }
  // ... more products
]

 * Filter by category and search by name:
   GET http://localhost:3000/api/products?category=electronics&search=phone

   Response:
   {
  "totalProducts": 1,
  "currentPage": 1,
  "totalPages": 1,
  "products": [
    {
      "id": "2",
      "name": "Smartphone",
      "description": "Latest model with 128GB storage",
      "price": 800,
      "category": "electronics",
      "inStock": true
    }
  ]
}

 * Paginate products (page 1, limit 2):
   GET http://localhost:3000/api/products?page=1&limit=2

   Response:
   {
  "totalProducts": 5,
  "currentPage": 1,
  "totalPages": 3,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    },
    {
      "id": "2",
      "name": "Smartphone",
      "description": "Latest model with 128GB storage",
      "price": 800,
      "category": "electronics",
      "inStock": true
    }
  ]
}

GET /api/products/:id
 * Description: Retrieves a single product by its unique ID.
 * URL Parameters:
   * id: The unique identifier of the product.
 * Response:
   * 200 OK
   * Body: application/json product object.
   * 404 Not Found if the product does not exist.
Example:
GET http://localhost:3000/api/products/1

Response:
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}

POST /api/products
 * Description: Creates a new product.
 * Authentication: Requires x-api-key: mysecretapikey header.
 * Request Body: application/json product object (without id).
   * name (string, required)
   * description (string, required)
   * price (number, required, must be positive)
   * category (string, required)
   * inStock (boolean, required)
 * Response:
   * 201 Created
   * Body: application/json object of the newly created product, including its generated id.
   * 400 Bad Request if validation fails.
   * 401 Unauthorized if API key is missing or invalid.
Example:
POST http://localhost:3000/api/products
Content-Type: application/json
X-API-Key: mysecretapikey

{
  "name": "Smart Speaker",
  "description": "Voice-controlled smart speaker with AI assistant",
  "price": 99.99,
  "category": "electronics",
  "inStock": true
}

Response:
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef", // UUID generated
  "name": "Smart Speaker",
  "description": "Voice-controlled smart speaker with AI assistant",
  "price": 99.99,
  "category": "electronics",
  "inStock": true
}

PUT /api/products/:id
 * Description: Updates an existing product identified by its ID.
 * URL Parameters:
   * id: The unique identifier of the product to update.
 * Authentication: Requires x-api-key: mysecretapikey header.
 * Request Body: application/json product object with updated fields. All fields are required for a successful update (validation middleware checks for completeness).
 * Response:
   * 200 OK
   * Body: application/json object of the updated product.
   * 400 Bad Request if validation fails.
   * 401 Unauthorized if API key is missing or invalid.
   * 404 Not Found if the product does not exist.
Example:
PUT http://localhost:3000/api/products/1
Content-Type: application/json
X-API-Key: mysecretapikey

{
  "name": "Laptop Pro",
  "description": "Updated high-performance laptop with 32GB RAM and SSD",
  "price": 1800,
  "category": "electronics",
  "inStock": true
}

Response:
{
  "id": "1",
  "name": "Laptop Pro",
  "description": "Updated high-performance laptop with 32GB RAM and SSD",
  "price": 1800,
  "category": "electronics",
  "inStock": true
}

DELETE /api/products/:id
 * Description: Deletes a product identified by its ID.
 * URL Parameters:
   * id: The unique identifier of the product to delete.
 * Authentication: Requires x-api-key: mysecretapikey header.
 * Response:
   * 204 No Content if the product is successfully deleted.
   * 401 Unauthorized if API key is missing or invalid.
   * 404 Not Found if the product does not exist.
Example:
DELETE http://localhost:3000/api/products/3
X-API-Key: mysecretapikey

Response:
 * (No Content, successful deletion)
Statistics Resource (/api/products/statistics)
GET /api/products/statistics
 * Description: Retrieves statistics about products, e.g., count by category.
 * Response:
   * 200 OK
   * Body: application/json object where keys are categories and values are counts.
Example:
GET http://localhost:3000/api/products/statistics

Response:
{
  "electronics": 3,
  "kitchen": 1
}

Error Handling
The API implements centralized error handling, providing consistent error responses.
 * 400 Bad Request (ValidationError): Sent when request payload fails validation checks (e.g., missing required fields, incorrect data types).
   {
  "message": "Product name is required and must be a string."
}

 * 401 Unauthorized (UnauthorizedError): Sent when the x-api-key header is missing or invalid for authenticated routes.
   {
  "message": "Unauthorized: Missing or invalid API key."
}

 * 404 Not Found (NotFoundError): Sent when a requested resource (e.g., product by ID) does not exist.
   {
  "message": "Product not found."
}

 * 500 Internal Server Error: A generic error for unexpected server-side issues.
Authentication
Some routes (POST, PUT, DELETE for products) require an API key for authentication. This key must be sent in the request headers as X-API-Key.
Required Header:
X-API-Key: mysecretapikey
Project Structure
.
├── server.js             # Main Express app setup and entry point
├── api.routes.js         # Defines all product-related API routes
├── middleware.js         # Contains custom middleware functions (logger, auth, validation)
└── errorHandling.js      # Defines custom error classes and global error handler
├── package.json          # Project metadata and dependencies
└── package-lock.json     # Records exact dependency versions

