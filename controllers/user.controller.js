import userModel from "../models/user.js";
import { sendToken } from "../utils/features.js";

const newUser = async (req, res) => {
  let name = req.body.name;

  const { email, password, username } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  if (!username) {
    return res
      .status(400)
      .json({ success: false, message: "Username is required" });
  }

  if (!name) {
    name = username;
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

  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
};

const login = async (req, res) => {
  res.send("Login route is working!");
};

export { login, newUser };
