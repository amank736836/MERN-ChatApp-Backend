import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config as envConfig } from "dotenv";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { errorMiddleware, TryCatch } from "./middlewares/error.js";
import messageModel from "./models/message.models.js";
import adminRouter from "./routes/admin.routes.js";
import chatRouter from "./routes/chat.routes.js";
import userRouter from "./routes/user.routes.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./utils/events.js";
import { connectDB, getSockets } from "./utils/features.js";

envConfig({
  path: "./.env",
});

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV.trim() || "production";
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "Admin@1234";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLIENT_URL = process.env.CLIENT_URL;

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

if (!MONGODB_URI) {
  console.error("MongoDB URI is not defined in the environment variables.");
  process.exit(1);
}

if (!CLOUDINARY_CLOUD_NAME) {
  console.error(
    "Cloudinary Cloud Name is not defined in the environment variables."
  );
  process.exit(1);
}

if (!CLOUDINARY_API_KEY) {
  console.error(
    "Cloudinary API Key is not defined in the environment variables."
  );
  process.exit(1);
}

if (!CLOUDINARY_API_SECRET) {
  console.error(
    "Cloudinary API Secret is not defined in the environment variables."
  );
  process.exit(1);
}

if (!CLIENT_URL) {
  console.error("Client URL is not defined in the environment variables.");
  process.exit(1);
}

connectDB(MONGODB_URI);

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ origin: [CLIENT_URL], credentials: true }));

const server = createServer(app);
const io = new Server(server, {});

if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.get("/", (req, res) => {
  res.send(
    `<h1>
      <center>Welcome to the Home Page</center>
    </h1>`
  );
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/admin", adminRouter);

const userSocketIDs = new Map();

io.use((socket, next) => {
  const token = socket.handshake.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return next(new Error("Authentication error"));
  }
  next();
});

io.on(
  "connection",
  TryCatch((socket) => {
    console.log("User connected ", socket.id);

    const user = {
      _id: "67f7e0b18361a6b32f1b16b6",
      name: "Aman",
    };

    userSocketIDs.set(user._id.toString(), socket.id);

    socket.on(NEW_MESSAGE, async ({ chatId, message, members }) => {
      const messageForRealTime = {
        content: message,
        _id: uuid(),
        sender: {
          _id: user._id,
          name: user.name,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      const messageForDB = {
        content: message,
        chat: chatId,
        sender: user._id,
        attachments: [],
      };

      const membersSocket = getSockets(members);

      io.to(membersSocket).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealTime,
      });

      io.to(membersSocket).emit(NEW_MESSAGE_ALERT, {
        chatId,
      });

      await messageModel.create(messageForDB);
    });

    socket.on("disconnect", () => {
      userSocketIDs.delete(user._id.toString());
      console.log("User disconnected");
    });
  })
);

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
});

// createUser(10);
// createSingleChat(10);
// createGroupChat(10);
// createMessageInChat("67fb7776f8f575c2c3403c33", 50);

export {
  ADMIN_SECRET_KEY,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  NODE_ENV,
  userSocketIDs
};

