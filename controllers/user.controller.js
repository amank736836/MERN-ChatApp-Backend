import { compare } from "bcrypt";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import userModel from "../models/user.models.js";
import { cookieOptions, sendToken } from "../utils/features.js";

const newUser = TryCatch(async (req, res, next) => {
  let name = req.body.name;

  const { email, password, username } = req.body;

  if (!email) return next(new ErrorHandler("Email is required", 400));

  if (!email.includes("@")) return next(new ErrorHandler("Invalid email", 400));

  if (!password) return next(new ErrorHandler("Password is required", 400));

  if (!username) return next(new ErrorHandler("Username is required", 400));

  if (!name) {
    name = username || email.split("@")[0];
  }

  const avatar = {
    public_id: "sample_public_id",
    url: "https://example.com/sample_avatar.jpg",
  };

  const user = await userModel.create({
    name,
    email,
    username,
    password,
    avatar,
  });

  sendToken(res, user, 201, "User created successfully");
});

const login = TryCatch(async (req, res, next) => {
  const { username, password, email } = req.body;

  if (!username && !email)
    return next(new ErrorHandler("Username or email is required", 400));

  if (!password) return next(new ErrorHandler("Password is required", 400));

  const user = await userModel
    .findOne({
      $or: [{ username }, { email }],
    })
    .select("+password");

  if (!user) return next(new ErrorHandler("User not found", 404));

  const isMatch = await compare(password, user.password);

  if (!isMatch) return next(new ErrorHandler("Invalid password", 401));

  sendToken(res, user, 200, "Welcome Back!");
});

const getMyProfile = TryCatch(async (req, res, next) => {
  if (!req.userId)
    return next(new ErrorHandler("Login to access this resource", 401));

  const user = await userModel.findById(req.userId);

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res, next) => {
  res.cookie("StealthyNoteToken", null, {
    ...cookieOptions,
    maxAge: 0,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const searchUser = TryCatch(async (req, res, next) => {
  const { name } = req.query;

  res.status(200).json({
    success: true,
    message: `Search for ${name}`,
  });
});

export { getMyProfile, login, newUser, logout, searchUser };
