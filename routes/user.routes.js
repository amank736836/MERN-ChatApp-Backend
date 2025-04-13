import express from "express";
import jwt from "jsonwebtoken";
import {
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
} from "../controllers/user.controller.js";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import { singleAvatar } from "../middlewares/multer.js";

const userRouter = express.Router();

const isAuthenticated = TryCatch(async (req, res, next) => {
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

userRouter.post("/new", singleAvatar, newUser);
userRouter.post("/login", login);

userRouter.use(isAuthenticated);

userRouter.get("/me", getMyProfile);
userRouter.get("/logout", logout);
userRouter.get("/search", searchUser);

export default userRouter;
export { isAuthenticated };
