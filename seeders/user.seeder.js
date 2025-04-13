import { faker } from "@faker-js/faker";
import userModel from "../models/user.models.js";

const createUser = async (numUsers) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = userModel.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        username: faker.internet.username().replace(/[^a-zA-Z0-9]/g, ""),
        password: "amank@2002",
        avatar: {
          public_id: faker.system.fileName(),
          url: faker.image.avatar(),
        },
      });
      usersPromise.push(tempUser);
    }

    const users = await Promise.all(usersPromise);

    console.log(`${users.length} users created successfully!`, users);
  } catch (error) {
    console.error("Error creating users:", error.message);
    process.exit(1);
  }
};

export { createUser };
