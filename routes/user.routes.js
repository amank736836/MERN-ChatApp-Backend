import express from "express";
import { login, newUser } from "../controllers/user.controller.js";
import { singleAvatar } from "../middlewares/multer.js";

const user = express.Router();

user.post("/new", singleAvatar, newUser);
user.post("/login", login);

export default user;
