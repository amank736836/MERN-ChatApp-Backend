import { ErrorHandler, TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies.StealthyNoteToken;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedData) {
    return next(new ErrorHandler("Invalid Token", 401));
  }

  req.userId = decodedData.id;

  next();
});

const adminOnly = TryCatch((req, res, next) => {
  const token = req.cookies.StealthyNoteAdminToken;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedData) {
    return next(new ErrorHandler("Invalid Token", 401));
  }

  const adminSecretKey = decodedData.secretKey;
  const isMatch = adminSecretKey === process.env.ADMIN_SECRET_KEY;

  if (!isMatch) {
    return next(new ErrorHandler("Invalid Admin secret key", 401));
  }

  next();
});

export { isAuthenticated, adminOnly };
