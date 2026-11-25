export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || 'Internal server error.';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path || 'resource'} identifier.`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((item) => item.message);
    message = messages.join(' ');
  } else if (err.code === 11000) {
    statusCode = 400;
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with that ${duplicateField} already exists.`;
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
