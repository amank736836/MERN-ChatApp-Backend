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
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV.trim() || "production";
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "Admin@1234";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  console.error("JWT Secret is not defined in the environment variables.");
  process.exit(1);
}

if (!ADMIN_SECRET_KEY) {
  console.error(
    "Admin Secret Key is not defined in the environment variables."
  );
  process.exit(1);
}

if (!NODE_ENV) {
  console.error(
    "Node Environment is not defined in the environment variables."
  );
  process.exit(1);
}

if (!PORT) {
  console.error("Port is not defined in the environment variables.");
  process.exit(1);
}

if (!JWT_EXPIRES_IN) {
  console.error("JWT Expires In is not defined in the environment variables.");
  process.exit(1);
}

if (!mongoDB_uri) {
  console.error("MongoDB URI is not defined in the environment variables.");
  process.exit(1);
}

connectDB(mongoDB_uri);

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
});

export { NODE_ENV, ADMIN_SECRET_KEY, JWT_SECRET, JWT_EXPIRES_IN };
