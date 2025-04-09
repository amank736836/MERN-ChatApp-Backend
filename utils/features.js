import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose
    .connect(url, { dbName: "StealthyNote" })
    .then((data) => {
      console.log(`MongoDB connected to: ${data.connection.host}`);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export { connectDB };
