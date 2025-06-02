// server.js
const express = require('express');
const bodyParser = require('body-parser');
const productsRoutes = require('./api.routes');
const { loggerMiddleware, authMiddleware, validateProduct } = require('./middleware');
const { globalErrorHandler } = require('./errorHandling');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// API Routes
app.use('/api/products', productsRoutes); // All product routes are now handled by productsRoutes

// Global error handling middleware - MUST be last
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export for testing
