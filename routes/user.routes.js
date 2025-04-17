import express, { Router } from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../utils/validators.js";

const userRouter = Router();

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
userRouter.get("/notifications", getMyNotifications);
userRouter.get("/logout", logout);
userRouter.get("/search", searchUser);

userRouter.put(
  "/sendRequest",
  sendRequestValidator(),
  validateHandler,
  sendFriendRequest
);

userRouter.put(
  "/acceptRequest",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);

userRouter.get("/friends", getMyFriends);

export default userRouter;
