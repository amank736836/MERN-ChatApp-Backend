````markdown
# MERN ChatApp Backend

A Node.js & Express.js backend for ChatChamp, a real‑time anonymous chat application powered by MongoDB, Socket.IO, JWT authentication, file uploads, email notifications, AI‑driven features, and social interactions (friends & notifications).

---

## 🚀 Features

- **RESTful API** for user registration, login, profiles, and social interactions (friends, notifications)  
- **Admin API** for administrative operations (statistics, user/chat/message overviews)  
- **Chat API** for one‑to‑one and group chat operations (messaging, group management, attachments)  
- **WebSocket Server** using Socket.IO for real‑time messaging, typing indicators, and presence  
- **Anonymous Messaging** support alongside authenticated chat flows  
- **JWT Authentication** with access‑token expiration and secure HTTP‑only cookies  
- **Password Security** via bcrypt hashing  
- **Media Uploads** to Cloudinary (images, files)  
- **Email Notifications** with Nodemailer for account actions and alerts  
- **AI Integration** hooks using Google Generative AI SDK for smart replies  
- **Configurable** entirely via environment variables

---

## 🛠️ Tech Stack

- **Runtime & Framework:** Node.js (ES Modules), Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Real‑Time:** Socket.IO  
- **Auth & Security:** JSON Web Tokens, bcrypt, express-validator, cookie-parser, CORS  
- **File Storage:** Multer, Cloudinary SDK  
- **Email:** Nodemailer  
- **AI SDK:** `@ai-sdk/google`, `ai`  
- **Dev Tools:** nodemon, morgan, dotenv, uuid, `@faker-js/faker`

---

## 📦 Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/amank736836/MERN-ChatApp-Backend.git
   cd MERN-ChatApp-Backend
````

2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Configure environment**
   Create a `.env` file in the project root with the variables listed below.
4. **Start the server**

   * Development (hot reload):

     ```bash
     npm run dev
     ```
   * Production:

     ```bash
     npm start
     ```

---

## 🔧 Environment Variables

```dotenv
# Server & Database
MONGODB_URI=your_mongo_connection_string
PORT=5000
NODE_ENV=development

# JWT & Cookies
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
STEALTHY_NOTE_TOKEN_NAME=token_name
STEALTHY_NOTE_ADMIN_TOKEN_NAME=admin_token_name
ADMIN_SECRET_KEY=admin_only_secret

# Client URLs
CLIENT_URL=http://localhost:3000
CLIENT_PRODUCTION_URL=https://chatchamp.vercel.app

# Email (Nodemailer)
NODE_MAILER_EMAIL=your_email@example.com
NODE_MAILER_PASSWORD=your_email_password

# Cloudinary (Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=your_cloudinary_url

# AI Integration
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
```

---

## 📖 HTTP API Endpoints

### Public Auth

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| POST   | `/api/auth/register`       | Register new user          |
| POST   | `/api/auth/login`          | Authenticate & receive JWT |
| POST   | `/api/auth/verify`         | Verify user (email/code)   |
| POST   | `/api/auth/forgotPassword` | Request password reset     |
| POST   | `/api/auth/updatePassword` | Update with new password   |
| GET    | `/api/auth/logout`         | Clear auth cookie          |

---

### User Routes

> All these routes require a valid session (`isAuthenticated` middleware).

| Method | Endpoint                    | Description                             |
| ------ | --------------------------- | --------------------------------------- |
| GET    | `/api/users/me`             | Get current user’s profile              |
| GET    | `/api/users/notifications`  | Fetch current user’s notifications      |
| GET    | `/api/users/search`         | Search for other users by name or email |
| GET    | `/api/users/friends`        | List current user’s friends             |
| POST   | `/api/users/sendRequest`    | Send a friend request                   |
| PUT    | `/api/users/acceptRequest`  | Accept a friend request                 |
| POST   | `/api/users/acceptMessages` | Enable/disable accepting messages       |

---

### Chat Routes

> All chat routes require user authentication (`isAuthenticated` middleware).

| Method | Endpoint                    | Description                                            |
| ------ | --------------------------- | ------------------------------------------------------ |
| POST   | `/api/chat/suggestMessages` | Get AI‑driven suggestions for the current conversation |
| POST   | `/api/chat/sendMessage`     | Send a new text message                                |
| GET    | `/api/chat`                 | Retrieve list of chats the user is a part of           |
| GET    | `/api/chat/group`           | Retrieve all group chats                               |
| POST   | `/api/chat/group`           | Create a new group chat                                |
| PUT    | `/api/chat/group`           | Add members to an existing group chat                  |
| DELETE | `/api/chat/group`           | Leave a group chat                                     |
| PUT    | `/api/chat/removeMember`    | Remove a member from a group chat                      |
| POST   | `/api/chat/message`         | Send attachments (images/files) to a chat              |
| GET    | `/api/chat/message/:chatId` | Get all messages for a specific chat                   |
| GET    | `/api/chat/:chatId`         | Get chat details (one‑to‑one or group)                 |
| PUT    | `/api/chat/:chatId`         | Rename a group chat                                    |
| DELETE | `/api/chat/:chatId`         | Delete a chat (one‑to‑one or group)                    |

---

## 🔌 WebSocket Events

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -m "Add xyz"`)
4. Push to your branch (`git push origin feature/xyz`)
5. Open a Pull Request

Please follow existing code style and include tests where applicable.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

```
```
