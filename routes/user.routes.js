import express from "express";
import {
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";
import {
  loginValidator,
  registerValidator,
  validateHandler,
} from "../utils/validators.js";

const userRouter = express.Router();

userRouter.post(
  "/new",
  singleAvatar,
  registerValidator(),
  validateHandler,
  newUser
);
userRouter.post("/login", loginValidator(), validateHandler, login);

userRouter.use(isAuthenticated);

userRouter.get("/me", getMyProfile);
userRouter.get("/logout", logout);
userRouter.get("/search", searchUser);

export default userRouter;
