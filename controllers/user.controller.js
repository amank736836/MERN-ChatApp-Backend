import userModel from "../models/user.js";

const newUser = async (req, res) => {
  const avatar = {
    public_id: "sample_public_id",
    url: "https://example.com/sample_avatar.jpg",
  };

  await userModel.create({
    name: "John Doe",
    username: "johndoe",
    password: "password123",
    avatar: avatar,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
};

const login = async (req, res) => {
  res.send("Login route is working!");
};

export { login, newUser };
