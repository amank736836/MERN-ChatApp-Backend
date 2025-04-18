import { Router } from "express";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import {
  addMembersValidator,
  idValidator,
  leaveGroupValidator,
  newGroupChatValidator,
  removeMembersValidator,
  renameGroupValidator,
  sendAttachmentsValidator,
  validateHandler,
} from "../utils/validators.js";

const chatRouter = Router();

chatRouter.use(isAuthenticated);

// chatRouter.get("/my", getMyChats);
// chatRouter.post("/new", newGroupChat);
// chatRouter.put("/addMembers", addMembers);
// chatRouter.delete("/leave/:id", leaveGroup);

chatRouter
  .route("/")
  .get(getMyChats)
  .post(newGroupChatValidator(), validateHandler, newGroupChat)
  .put(addMembersValidator(), validateHandler, addMembers)
  .delete(leaveGroupValidator(), validateHandler, leaveGroup);

chatRouter.get("/my/groups", getMyGroups);

chatRouter.put(
  "/removeMembers",
  removeMembersValidator(),
  validateHandler,
  removeMembers
);

chatRouter.get("/message/:id", idValidator(), validateHandler, getMessages);

chatRouter.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachments
);

chatRouter
  .route("/:id")
  .get(idValidator(), validateHandler, getChatDetails)
  .put(renameGroupValidator(), validateHandler, renameGroup)
  .delete(idValidator(), validateHandler, deleteChat);

export default chatRouter;
