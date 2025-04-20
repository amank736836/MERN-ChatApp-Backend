import { NODE_ENV } from "../app.js";

class ErrorHandler extends Error {
  constructor(message = "Internal Server Error", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errCheck = (err) => {
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

  if (err.code === "ECONNREFUSED") {
    err.message = "MongoDB connection refused. Please check your connection.";
    err.statusCode = 500;
  } else if (err.name === "MongoParseError") {
    err.message =
      "MongoDB URI is not valid. Please check your connection string.";
    err.statusCode = 500;
  } else if (err.name === "MongoNetworkError") {
    err.message = "MongoDB network error. Please check your connection.";
    err.statusCode = 500;
  } else if (err.name === "MongooseError") {
    err.message = "Mongoose error. Please check your connection.";
    err.statusCode = 500;
  } else if (err.name === "ValidationError") {
    err.message = "MongoDB validation error. Please check your data.";
    err.statusCode = 400;
  } else if (err.name === "MongoTimeoutError") {
    err.message = "MongoDB connection timeout. Please check your connection.";
    err.statusCode = 500;
  } else if (err.name === "MongoServerError") {
    err.message = "MongoDB server error. Please check your connection.";
    err.statusCode = 500;
  } else if (err.name === "MongooseServerSelectionError") {
    err.message =
      "MongoDB server selection error. Please check your connection.";
    err.statusCode = 500;
  } else if (err.name === "MongooseDisconnectedError") {
    err.message = "MongoDB disconnected error. Please check your connection.";
    err.statusCode = 500;
  } else if (err.name === "MongooseSchemaValidationError") {
    err.message = "MongoDB schema validation error. Please check your data.";
    err.statusCode = 400;
  }

  return err;
};

const errorMiddleware = (err, req, res, next) => {
  err = errCheck(err);

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

export { errorMiddleware, TryCatch, ErrorHandler, errCheck };
