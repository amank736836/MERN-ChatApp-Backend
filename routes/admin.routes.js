import { Router } from "express";
import { allChats, allUsers } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/", allUsers);
adminRouter.get("/verify", allUsers);
adminRouter.get("/logout", allUsers);

adminRouter.get("/stats", allUsers);

adminRouter.get("/users", allUsers);
adminRouter.get("/chats", allChats);
adminRouter.get("/messages", allUsers);

export default adminRouter;
