import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import {
  cookieOptions,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  userSocketIDs,
} from "../app.js";
import { errCheck, ErrorHandler } from "../middlewares/error.js";

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
      user,
    });
};

const emitEvent = (req, event, users, message = "") => {
  console.log("Event emitted:", event, users, message);
};

const getSockets = (users = []) =>
  users.map((user) => userSocketIDs.get(user.toString()));

const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        { folder: "StealthyNote", resource_type: "auto", public_id: uuid() },

        (error, result) => {
          if (error) {
            console.error("Error uploading file to Cloudinary:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => {
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    });

    return formattedResults;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw new ErrorHandler("Failed to upload files to Cloudinary");
  }
};

const deleteFilesFromCloudinary = async (publicIds = []) => {};

export {
  connectDB,
  deleteFilesFromCloudinary,
  emitEvent,
  getBase64,
  getSockets,
  sendToken,
  uploadFilesToCloudinary,
};
