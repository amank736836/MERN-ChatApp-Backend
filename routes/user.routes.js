import express from "express";
import { login, newUser } from "../controllers/user.controller.js";

const user = express.Router();



user.post("/new", newUser);
user.post("/login", login);

export default user;
