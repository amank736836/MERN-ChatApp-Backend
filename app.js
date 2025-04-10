import express from "express";
import user from "./routes/user.routes.js";
import { connectDB } from "./utils/features.js";
import { config as envConfig } from "dotenv";
import morgan from "morgan";

envConfig({
  path: "./.env",
});

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const mongoDB_uri = process.env.MONGODB_URI;
if (!mongoDB_uri) {
  console.error("MongoDB URI is not defined in the environment variables.");
  process.exit(1);
}
connectDB(mongoDB_uri);
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(
    `<h1>
      <center>Welcome to the Home Page</center>
    </h1>`
  );
});

app.use("/user", user);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
