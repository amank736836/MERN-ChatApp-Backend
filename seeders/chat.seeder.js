import { faker, simpleFaker } from "@faker-js/faker";
import chatModel from "../models/chat.models.js";
import userModel from "../models/user.models.js";

const createSingleChat = async (chatsCount) => {
  try {
    const users = await userModel.find().select("_id name");

    const chatsPromise = [];

    let maxChats = users.length < chatsCount ? users.length : chatsCount;


    for (let i = 0; i < maxChats; i++) {
      for (let j = i + 1; j < maxChats; j++) {
        chatsPromise.push(
          chatModel.create({
            name: `${users[i].name} - ${users[j].name}`,
            groupChat: false,
            members: [users[i]._id, users[j]._id],
            creator: users[i]._id,
          })
        );
      }
    }

    const chats = await Promise.all(chatsPromise);

    console.log(`${chats.length} chats created successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error creating chats:", error.message);
    process.exit(1);
  }
};
const createGroupChat = async (chatsCount) => {
  try {
    const users = await userModel.find().select("_id");

    const chatsPromise = [];

    for (let i = 0; i < chatsCount; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });

      const members = [];

      for (let j = 0; j < numMembers; j++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];

        if (!members.includes(randomUser)) {
          members.push(randomUser);
        }
      }

      const chat = chatModel.create({
        groupChat: true,
        name: faker.lorem.words(2),
        members,
        creator: members[0],
      });

      chatsPromise.push(chat);
    }

    const chats = await Promise.all(chatsPromise);

    console.log(`${chats.length} group chats created successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error creating group chats:", error.message);
    process.exit(1);
  }
};
export { createGroupChat, createSingleChat };
