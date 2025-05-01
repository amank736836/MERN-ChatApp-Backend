import { faker } from "@faker-js/faker";
import chatModel from "../models/chat.models.js";
import messageModel from "../models/message.models.js";
import userModel from "../models/user.models.js";

const createMessages = async (messagesCount) => {
  try {
    const users = await userModel.find().select("_id");
    const chats = await chatModel.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < messagesCount; i++) {
      const randomChatIndex = Math.floor(Math.random() * chats.length);
      const randomUserIndex = Math.floor(Math.random() * users.length);

      const randomChat = chats[randomChatIndex];
      const randomUser = users[randomUserIndex];

      const message = messageModel.create({
        chat: randomChat,
        sender: randomUser,
        content: faker.lorem.sentence(),
      });

      messagesPromise.push(message);
    }

    const messages = await Promise.all(messagesPromise);

    console.log(`${messages.length} messages created successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating messages:", error.message);
    process.exit(1);
  }
};

const createMessageInChat = async (chatId, messagesCount) => {
  try {
    const users = await userModel.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < messagesCount; i++) {
      const randomUserIndex = Math.floor(Math.random() * users.length);

      const randomUser = users[randomUserIndex];

      const message = messageModel.create({
        chat: chatId,
        sender: randomUser,
        content: faker.lorem.sentence(),
      });

      messagesPromise.push(message);
    }

    const messages = await Promise.all(messagesPromise);

    console.log(`${messages.length} messages created successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating messages:", error.message);
    process.exit(1);
  }
};

export { createMessageInChat, createMessages };

