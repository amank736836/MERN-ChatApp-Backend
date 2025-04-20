import { compare } from "bcrypt";
import { NEW_REQUEST, REFETCH_CHATS } from "../utils/events.js";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import chatModel from "../models/chat.models.js";
import requestModel from "../models/request.models.js";
import userModel from "../models/user.models.js";
import { cookieOptions, emitEvent, sendToken } from "../utils/features.js";

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

  const file = req.file;

  if (!file) {
    return next(new ErrorHandler("Avatar is required", 400));
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
  const { name = "" } = req.query;

  const myChats = await chatModel.find({
    groupChat: false,
    members: req.userId,
  });

  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  const allUsersExceptMeAndFriends = await userModel.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" },
  });

  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    id: _id,
    name,
    avatar: avatar.url,
  }));

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

  const newRequest = await requestModel.create({
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

  const newChat = await chatModel.create({
    members,
    name: `${request.sender.name} - ${request.receiver.name}`,
    groupChat: false,
  });

  await request.deleteOne();

  emitEvent(req, REFETCH_CHATS, [members], "Friend request accepted");

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

  const friends = chats.map(({ members }) => {
    const otherMember = members.find(
      (member) => member._id.toString() !== req.userId
    );

    return {
      _id: otherMember._id,
      name: otherMember.name,
      avatar: otherMember.avatar.url,
    };
  });

  if (chatId) {
    const chat = await chatModel.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    const availableFriends = friends.filter(
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
      friends,
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
