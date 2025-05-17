
---

# 🛠️ ChatChamp Backend (Node.js + Express) 🚀

Welcome to the **ChatChamp** backend repository! 🎉 This server-side component of ChatChamp handles user authentication, chat management, real-time messaging via WebSockets, and integrates with various services for enhanced functionality. 🔐💬

---

## 🌐 Live Demo 🔗

👉 [chatchamp.vercel.app](https://chatchamp.vercel.app) 🌍

---

## 👨‍💻 Developer 🛠️

* **Name:** Aman Kumar 👤
* **LinkedIn:** [linkedin.com/in/amank736836](https://www.linkedin.com/in/amank736836) 🔗
* **Portfolio:** [amank736836.vercel.app](https://amank736836.vercel.app) 🌟
* **Feedback:** [chatchamp.vercel.app/u/amank736836](https://chatchamp.vercel.app/u/amank736836) 📋

---

## 📂 Repositories 📁

* **Main Repository:** [github.com/amank736836/MERN-ChatApp](https://github.com/amank736836/MERN-ChatApp) 🗃️
* **Frontend Repo:** [github.com/amank736836/MERN-ChatApp-Frontend](https://github.com/amank736836/MERN-ChatApp-Frontend) 🎨
* **Backend Repo:** [github.com/amank736836/MERN-ChatApp-Backend](https://github.com/amank736836/MERN-ChatApp-Backend) 🛠️

---

## 🚀 Features ✨

* **Real-Time Communication:** Instant messaging powered by Socket.IO ⚡
* **Authentication:** Secure login and registration using JWT and HTTP-only cookies 🔐
* **AI Suggestions:** Smart message suggestions via Google Generative AI SDK 🤖
* **Media Uploads:** Upload and manage media files using Cloudinary 🖼️
* **Admin Panel:** Manage users, chats, and messages with comprehensive statistics 📊
* **Email Notifications:** Send emails using Nodemailer 📧
* **Environment Configuration:** Manage environment variables with dotenv 🧪

---

## 🛠️ Tech Stack 🧱

* **Runtime:** Node.js 🟢
* **Framework:** Express.js 🚂
* **Database:** MongoDB with Mongoose 🍃
* **Real-Time Communication:** Socket.IO 📡
* **Authentication:** JSON Web Tokens (JWT) 🔑
* **File Uploads:** Multer 📁
* **Cloud Storage:** Cloudinary ☁️
* **Email Service:** Nodemailer 📬
* **AI Integration:** Google Generative AI SDK 🤖
* **Logging:** Morgan 📋
* **Environment Variables:** dotenv 🧪

---

## 📦 Installation & Setup 🧰

### 1. Clone the Repository 🧬

```bash
git clone https://github.com/amank736836/MERN-ChatApp-Backend.git
cd MERN-ChatApp-Backend
```

### 2. Install Dependencies 📥

```bash
npm install
```

### 3. Configure Environment Variables ⚙️

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:3000
CLIENT_PRODUCTION_URL=https://chatchamp.vercel.app
STEALTHY_NOTE_TOKEN_NAME=your_token_name
STEALTHY_NOTE_ADMIN_TOKEN_NAME=your_admin_token_name
ADMIN_SECRET_KEY=your_admin_secret_key
```

Replace the placeholder values with your actual configuration.

### 4. Run the Application ▶️

```bash
npm start
```

The server will start on `http://localhost:5000` 🌐

---

## 📖 API Structure 📚

All API endpoints are prefixed with `/api/v1` to support versioning and maintain backward compatibility. This structure allows for seamless integration of future updates without disrupting existing clients.

### 🔐 Authentication Routes

| Method | Endpoint                      | Description                |
| ------ | ----------------------------- | -------------------------- |
| POST   | `/api/v1/auth/register`       | Register new user          |
| POST   | `/api/v1/auth/login`          | Authenticate & receive JWT |
| POST   | `/api/v1/auth/verify`         | Verify user (email/code)   |
| POST   | `/api/v1/auth/forgotPassword` | Request password reset     |
| POST   | `/api/v1/auth/updatePassword` | Update with new password   |
| GET    | `/api/v1/auth/logout`         | Clear auth cookie          |

### 👤 User Routes

> All these routes require a valid session (`isAuthenticated` middleware).

| Method | Endpoint                       | Description                             |
| ------ | ------------------------------ | --------------------------------------- |
| GET    | `/api/v1/users/me`             | Get current user’s profile              |
| GET    | `/api/v1/users/notifications`  | Fetch current user’s notifications      |
| GET    | `/api/v1/users/search`         | Search for other users by name or email |
| GET    | `/api/v1/users/friends`        | List current user’s friends             |
| POST   | `/api/v1/users/sendRequest`    | Send a friend request                   |
| PUT    | `/api/v1/users/acceptRequest`  | Accept a friend request                 |
| POST   | `/api/v1/users/acceptMessages` | Enable/disable accepting messages       |

### 💬 Chat Routes

> All chat routes require user authentication (`isAuthenticated` middleware).

| Method | Endpoint                       | Description                                            |
| ------ | ------------------------------ | ------------------------------------------------------ |
| POST   | `/api/v1/chat/suggestMessages` | Get AI‑driven suggestions for the current conversation |
| POST   | `/api/v1/chat/sendMessage`     | Send a new text message                                |
| GET    | `/api/v1/chat`                 | Retrieve list of chats the user is a part of           |
| GET    | `/api/v1/chat/group`           | Retrieve all group chats                               |
| POST   | `/api/v1/chat/group`           | Create a new group chat                                |
| PUT    | `/api/v1/chat/group`           | Add members to an existing group chat                  |
| DELETE | `/api/v1/chat/group`           | Leave a group chat                                     |
| PUT    | `/api/v1/chat/removeMember`    | Remove a member from a group chat                      |
| POST   | `/api/v1/chat/message`         | Send attachments (images/files) to a chat              |
| GET    | `/api/v1/chat/message/:chatId` | Get all messages for a specific chat                   |
| GET    | `/api/v1/chat/:chatId`         | Get chat details (one‑to‑one or group)                 |
| PUT    | `/api/v1/chat/:chatId`         | Rename a group chat                                    |
| DELETE | `/api/v1/chat/:chatId`         | Delete a chat (one‑to‑one or group)                    |

---

## 🔌 WebSocket Events 📡

| Event               | Direction         | Description                                                                |
| ------------------- | ----------------- | -------------------------------------------------------------------------- |
| `NEW_MESSAGE`       | ↔ client ↔ server | Send or receive a new chat message.                                        |
| `NEW_MESSAGE_ALERT` | server → client   | Notify client of a message when not in the active chat.                    |
| `REFETCH_CHATS`     | server → client   | Instruct client to reload the chat list (e.g., after creating a new room). |
| `NEW_REQUEST`       | server → client   | Alert client of a new chat invitation or system notification.              |
| `ALERT`             | server → client   | Generic alert channel for system/error notifications.                      |
| `START_TYPING`      | ↔ client ↔ server | Notify when a user begins typing in a chat room.                           |
| `STOP_TYPING`       | ↔ client ↔ server | Notify when a user stops typing.                                           |
| `CHAT_JOINED`       | ↔ client ↔ server | Emitted when a user joins a room; server broadcasts to room members.       |
| `CHAT_LEAVED`       | ↔ client ↔ server | Emitted when a user leaves a room; server broadcasts to room members.      |
| `ONLINE_USERS`      | server → client   | Provides the current list of online users in a room or globally.           |

---

## 🤝 Contributing 🧑‍🤝‍🧑

1. Fork the repository 🍴
2. Create a new branch: `git checkout -b feature/your-feature-name` 🌿
3. Commit your changes: `git commit -m 'Add your feature'` 📝
4. Push to the branch: `git push origin feature/your-feature-name` 🚀
5. Open a pull request 📬

Please ensure your code follows the project's coding standards and includes relevant tests ✅

---

## 📄 License 📜

This project is licensed under the [MIT License](LICENSE) 🆓

---

## 📬 Contact 📞

For any inquiries or feedback, please reach out via [LinkedIn](https://www.linkedin.com/in/amank736836) or submit feedback through the [ChatChamp Feedback Page](https://chatchamp.vercel.app/u/amank736836) 💌

---