import { compare } from "bcrypt";
import { cookieOptions } from "../app.js";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import chatModel from "../models/chat.models.js";
import requestModel from "../models/request.models.js";
import userModel from "../models/user.models.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../utils/events.js";
import {
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
} from "../utils/features.js";

const newUser = TryCatch(async (req, res, next) => {
  const { name, email, password, username } = req.body;

  if (!name) {
    return next(new ErrorHandler("Name is required", 400));
  }

  if (name.length < 3) {
    return next(new ErrorHandler("Name must be at least 3 characters", 400));
  }

  if (!email) return next(new ErrorHandler("Email is required", 400));

  if (!email.includes("@")) return next(new ErrorHandler("Invalid email", 400));

  if (!password) return next(new ErrorHandler("Password is required", 400));

  if (!username) return next(new ErrorHandler("Username is required", 400));

  if (username.length < 3) {
    return next(
      new ErrorHandler("Username must be at least 3 characters", 400)
    );
  }

  if (username.length > 30) {
    return next(
      new ErrorHandler("Username must be at most 30 characters", 400)
    );
  }

  if (password.length < 6) {
    return next(
      new ErrorHandler("Password must be at least 6 characters", 400)
    );
  }

  if (password.length > 30) {
    return next(
      new ErrorHandler("Password must be at most 30 characters", 400)
    );
  }

  const file = req.file;

  if (!file) {
    return next(new ErrorHandler("Avatar is required", 400));
  }

  const result = await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
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
  const { username, password } = req.body;

  if (!username) return next(new ErrorHandler("Username is required", 400));

  if (!password) return next(new ErrorHandler("Password is required", 400));

  const user = await userModel
    .findOne({
      $or: [{ username }, { email: username }],
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
  const { name = "" } = req.query;

  const myChats = await chatModel.find({
    groupChat: false,
    members: req.userId,
  });

  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  allUsersFromMyChats.push(req.userId);

  const allUsersExceptMeAndFriends = await userModel.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" },
  });

  const allUsersRequest = await requestModel.find({
    $or: [{ sender: req.userId }, { receiver: req.userId }],
  });

  const allUsersExceptMeAndFriendsWithoutRequest =
    allUsersExceptMeAndFriends.filter(
      (user) =>
        !allUsersRequest.some(
          (request) =>
            (request.sender.toString() === user._id.toString() &&
              request.receiver.toString() === req.userId) ||
            (request.receiver.toString() === user._id.toString() &&
              request.sender.toString() === req.userId)
        )
    );

  const users = allUsersExceptMeAndFriendsWithoutRequest.map(
    ({ _id, name, avatar }) => ({
      id: _id,
      name,
      avatar: avatar.url,
    })
  );

  res.status(200).json({
    success: true,
    message: `Search for ${name}`,
    users,
  });
});

const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) return next(new ErrorHandler("User ID is required", 400));

  if (userId === req.userId) {
    return next(new ErrorHandler("You cannot send a request to yourself", 400));
  }

  console.log(userId, req.userId);

  const [requestSent, requestReceived] = await Promise.all([
    requestModel.findOne({
      sender: req.userId,
      receiver: userId,
    }),
    requestModel.findOne({
      sender: userId,
      receiver: req.userId,
    }),
  ]);

  if (requestSent) {
    return next(new ErrorHandler("Request already sent", 400));
  }

  if (requestReceived) {
    return next(new ErrorHandler("Request already received", 400));
  }

  await requestModel.create({
    sender: req.userId,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId], "New friend request received");

  res.status(200).json({
    success: true,
    message: "Friend request sent successfully",
  });
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  if (!requestId) return next(new ErrorHandler("Request ID is required", 400));

  if (accept === undefined) {
    return next(new ErrorHandler("Accept or reject is required", 400));
  }

  if (accept !== true && accept !== false) {
    return next(new ErrorHandler("Accept or reject must be a boolean", 400));
  }

  const request = await requestModel
    .findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.userId) {
    return next(
      new ErrorHandler(
        `You are not authorized to accept this request ${request}`,
        403
      )
    );
  }

  if (!accept) {
    await request.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Friend request rejected successfully",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await chatModel.create({
    members,
    name: `${request.sender.name} - ${request.receiver.name}`,
    groupChat: false,
  });

  await request.deleteOne();

  emitEvent(
    req,
    REFETCH_CHATS,
    [request.sender._id],
    "Friend request accepted"
  );

  return res.status(200).json({
    success: true,
    message: "Friend request accepted successfully",
    senderId: request.sender._id,
  });
});

const getMyNotifications = TryCatch(async (req, res, next) => {
  const requests = await requestModel
    .find({
      receiver: req.userId,
      status: "pending",
    })
    .populate("sender", "name avatar");

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  res.status(200).json({
    success: true,
    message: "All notifications",
    allRequests,
  });
});

const getMyFriends = TryCatch(async (req, res, next) => {
  const { chatId } = req.query;

  const chats = await chatModel
    .find({
      members: req.userId,
      groupChat: false,
    })
    .populate("members", "name avatar");

  const friendsExceptMe = chats.map(({ members }) => {
    const otherMember = members.find(
      (member) => member._id.toString() !== req.userId
    );

    return {
      _id: otherMember._id,
      name: otherMember.name,
      avatar: otherMember.avatar.url,
    };
  });

  const uniqueFriends = friendsExceptMe.filter(
    (friend, index, self) =>
      index ===
      self.findIndex((f) => f._id.toString() === friend._id.toString())
  );

  if (chatId) {
    const chat = await chatModel.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    const availableFriends = uniqueFriends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      message: "All friends",
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "All friends",
      friends: uniqueFriends,
    });
  }
});

export {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
};
