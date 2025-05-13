import { Router } from "express";
import {
  acceptFriendRequest,
  acceptMessages,
  forgotPassword,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
  updatePassword,
  verifyUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";
import {
  acceptRequestValidator,
  forgotPasswordValidator,
  isAcceptingMessagesValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  updatePasswordValidator,
  validateHandler,
  verifyValidator,
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

userRouter.post("/verify", verifyValidator(), validateHandler, verifyUser);

userRouter.post(
  "/forgotPassword",
  forgotPasswordValidator(),
  validateHandler,
  forgotPassword
);

userRouter.post(
  "/updatePassword",
  updatePasswordValidator(),
  validateHandler,
  updatePassword
);

userRouter.use(isAuthenticated);

userRouter.get("/me", getMyProfile);
userRouter.get("/notifications", getMyNotifications);
userRouter.get("/logout", logout);

userRouter.get("/search", searchUser);
userRouter.get("/friends", getMyFriends);

userRouter.post(
  "/acceptMessages",
  isAcceptingMessagesValidator(),
  validateHandler,
  acceptMessages
);

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

export default userRouter;
