/**
 * @description Centralized error handling middleware
 * @param {Object} err Error object
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} next Next function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for development
  console.error("Error Details:", {
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    status: err.statusCode || 500
  });

  // Determine status code
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode || 500;

  // Send consistent error response
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
