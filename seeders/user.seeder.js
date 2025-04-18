import { faker } from "@faker-js/faker";
import userModel from "../models/user.models.js";

const createUser = async (usersCount) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < usersCount; i++) {
      const tempUser = userModel.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        username: faker.internet.username().replace(/[^a-zA-Z0-9]/g, ""),
        password: "stealthyNotes",
        avatar: {
          public_id: faker.system.fileName(),
          url: faker.image.avatar(),
        },
      });
      usersPromise.push(tempUser);
    }

    const users = await Promise.all(usersPromise);

    console.log(`${users.length} users created successfully!`);
  } catch (error) {
    console.error("Error creating users:", error.message);
    process.exit(1);
  }
};

export { createUser };
