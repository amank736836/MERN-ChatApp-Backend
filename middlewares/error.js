import { NODE_ENV } from "../app.js";

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(", ");
    err.message = `Duplicate value entered for ${error} field, please use another value`;
    err.statusCode = 400;
  }

  if (err.name === "CastError") {
    err.message = `Resource not found. Invalid format: ${err.path}`;
    err.statusCode = 404;
  }

  if (err.name === "JsonWebTokenError") {
    err.message = "Invalid Token, please login again";
    err.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Token expired, please login again";
    err.statusCode = 401;
  }

  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors).map((value) => value.message)[0];
    err.statusCode = 400;
  }

  if (err.name === "MulterError") {
    err.message = err.message || "File upload error";
    err.statusCode = 400;
  }

  const response = {
    message: err.message,
    statusCode: err.statusCode,
  };

  if (NODE_ENV === "development") {
    response.error = err;
  }

  return res.status(err.statusCode).json(response);
};

const TryCatch = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export { errorMiddleware, TryCatch, ErrorHandler };
