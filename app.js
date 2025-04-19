import cookieParser from "cookie-parser";
import { config as envConfig } from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.js";
import adminRouter from "./routes/admin.routes.js";
import chatRouter from "./routes/chat.routes.js";
import userRouter from "./routes/user.routes.js";
import { connectDB } from "./utils/features.js";

envConfig({
  path: "./.env",
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const mongoDB_uri = process.env.MONGODB_URI;
if (!mongoDB_uri) {
  console.error("MongoDB URI is not defined in the environment variables.");
  process.exit(1);
}
connectDB(mongoDB_uri);
const port = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV.trim() || "production";

if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// createUser(10);
// createSingleChat(10);
// createGroupChat(10);
// createMessageInChat("67fb7776f8f575c2c3403c33", 50);

app.get("/", (req, res) => {
  res.send(
    `<h1>
      <center>Welcome to the Home Page</center>
    </h1>`
  );
});

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/admin", adminRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${NODE_ENV} mode`);
});

export { NODE_ENV };

