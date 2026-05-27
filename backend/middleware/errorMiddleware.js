// Custom 404 handler for routes that do not exist
export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error boundary formatter
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Print descriptive log in server console for observability
  if (process.env.NODE_ENV !== 'production' || statusCode >= 500) {
    console.error(`\x1b[31m[API Error] ${req.method} ${req.originalUrl} - Status ${statusCode}: ${message}\x1b[0m`);
  }

  // Handle Mongoose CastError (invalid ObjectId format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid identifier format';
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue)[0];
    message = `${duplicatedField.charAt(0).toUpperCase() + duplicatedField.slice(1)} already exists`;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Handle JSON Web Token Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Unauthorized: Invalid token signature';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Unauthorized: Token has expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
