// errorHandling.js

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Generic error for any unhandled exceptions
  res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  globalErrorHandler
};
