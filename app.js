import express from "express";
import user from "./routes/user.routes.js";
import { connectDB } from "./utils/features.js";

const app = express();

console.log(process.env.mongoDB_uri);
connectDB(process.env.mongoDB_uri);

app.use("/user", user);

app.get("/", (req, res) => {
  res.send(
    `<h1>
      <center>Welcome to the Home Page</center>
    </h1>`
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
