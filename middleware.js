// middleware.js
const { ValidationError, UnauthorizedError } = require('./errorHandling');

// Custom logger middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  // For demonstration purposes, a simple hardcoded API key
  if (!apiKey || apiKey !== 'mysecretapikey') {
    return next(new UnauthorizedError('Unauthorized: Missing or invalid API key.'));
  }
  next();
};

// Validation middleware for product creation and update
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || typeof name !== 'string') {
    return next(new ValidationError('Product name is required and must be a string.'));
  }
  if (!description || typeof description !== 'string') {
    return next(new ValidationError('Product description is required and must be a string.'));
  }
  if (typeof price !== 'number' || price <= 0) {
    return next(new ValidationError('Product price is required and must be a positive number.'));
  }
  if (!category || typeof category !== 'string') {
    return next(new ValidationError('Product category is required and must be a string.'));
  }
  if (typeof inStock !== 'boolean') {
    return next(new ValidationError('Product inStock status is required and must be a boolean.'));
  }
  next();
};

module.exports = {
  loggerMiddleware,
  authMiddleware,
  validateProduct
};
