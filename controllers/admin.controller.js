import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import userModel from "../models/user.models.js";
import chatModel from "../models/chat.models.js";
import messageModel from "../models/message.models.js";

const allUsers = TryCatch(async (req, res, next) => {
  const users = await userModel.find({}).sort({ createdAt: -1 });

  const transformedUsers = await Promise.all(
    users.map(async ({ _id, name, avatar, email, username, createdAt }) => {
      const [friends, groups] = await Promise.all([
        chatModel.countDocuments({ groupChat: false, members: _id }),
        chatModel.countDocuments({ groupChat: true, members: _id }),
      ]);

      return {
        _id,
        avatar: avatar.url,
        name,
        email,
        username,
        friends,
        groups,
        createdAt,
      };
    })
  );

  return res.status(200).json({
    success: true,
    message: "All users",
    users: transformedUsers,
  });
});

const allChats = TryCatch(async (req, res, next) => {
  const chats = await chatModel
    .find({})
    .sort({ createdAt: -1 })
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chats.map(async ({ _id, name, groupChat, members, creator }) => {
      const memberDetails = await Promise.all(
        members.map(async ({ _id, name, avatar: { url } }) => ({
          _id,
          name,
          avatar: url,
        }))
      );

      const totalMessages = await messageModel.countDocuments({
        chat: _id,
      });

      return {
        _id,
        name,
        groupChat,
        totalMessages,
        members: memberDetails,
        totalMembers: members.length,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        creator: {
          _id: creator?._id || null,
          name: creator?.name || "None",
          avatar: creator?.avatar?.url || "",
        },
      };
    })
  );

  return res.status(200).json({
    success: true,
    message: "All chats",
    chats: transformedChats,
  });
});

export { allUsers, allChats };
