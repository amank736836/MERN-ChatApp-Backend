import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  allChats,
  allMessages,
  allUsers,
  getAdminData,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
import { adminLoginValidator, validateHandler } from "../utils/validators.js";

const adminRouter = Router();

adminRouter.post("/verify", adminLoginValidator(), validateHandler, adminLogin);
adminRouter.get("/logout", adminLogout);

adminRouter.use(isAdminAuthenticated);

adminRouter.get("/", getAdminData);
adminRouter.get("/stats", getDashboardStats);

adminRouter.get("/users", allUsers);
adminRouter.get("/chats", allChats);
adminRouter.get("/messages", allMessages);

export default adminRouter;
