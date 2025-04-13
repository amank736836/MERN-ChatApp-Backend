import express from "express";
import {
    addMembers,
    getMyChats,
    getMyGroups,
    leaveGroup,
    newGroupChat,
    removeMembers,
} from "../controllers/chat.controller.js";
import { isAuthenticated } from "./user.routes.js";

const chatRouter = express.Router();

chatRouter.use(isAuthenticated);

chatRouter.post("/new", newGroupChat);

chatRouter.get("/my", getMyChats);

chatRouter.get("/my/groups", getMyGroups);

chatRouter.put("/addMembers", addMembers);

chatRouter.put("/removeMembers", removeMembers);

chatRouter.delete("/leave/:id", leaveGroup);

export default chatRouter;
