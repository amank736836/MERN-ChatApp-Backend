import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { JWT_EXPIRES_IN, JWT_SECRET, userSocketIDs } from "../app.js";
import { errCheck } from "../middlewares/error.js";

const connectDB = (url) => {
  mongoose
    .connect(url, { dbName: "StealthyNote" })
    .then((data) => {
      console.log(`MongoDB connected to: ${data.connection.host}`);
    })
    .catch((err) => {
      err = errCheck(err);

      throw new Error(err);
    });
};

const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || 7;

const cookieOptions = {
  maxAge: JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV.trim() === "production" ? true : false,
  sameSite: process.env.NODE_ENV.trim() === "production" ? "none" : "lax",
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return res
    .status(code)
    .cookie("StealthyNoteToken", token, cookieOptions)
    .json({
      success: true,
      message,
    });
};

const emitEvent = (req, event, users, message = "") => {
  console.log("Event emitted:", event, users, message);
};

export const getSockets = (users = []) =>
  users.map((user) => userSocketIDs.get(user.toString()));

const deleteFilesFromCloudinary = async (publicIds) => {};

export {
  connectDB,
  cookieOptions,
  deleteFilesFromCloudinary,
  emitEvent,
  sendToken,
};
