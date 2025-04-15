import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const connectDB = (url) => {
  mongoose
    .connect(url, { dbName: "StealthyNote" })
    .then((data) => {
      console.log(`MongoDB connected to: ${data.connection.host}`);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || 7;

const cookieOptions = {
  maxAge: JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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

const deleteFilesFromCloudinary = async (publicIds) => {};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
};
