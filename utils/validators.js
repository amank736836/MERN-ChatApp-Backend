import { body, check, param, validationResult } from "express-validator";
import { ErrorHandler } from "../middlewares/error.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  next(new ErrorHandler(errorMessages, 400));
};

const registerValidator = () => [
  body("username", "Please enter a username").notEmpty(),
  body("email", "Please enter a valid email").isEmail(),
  body("password", "Please enter a password").notEmpty(),
  check("avatar", "Please upload an avatar").notEmpty(),
];

const loginValidator = () => [
  body("username", "email", "Please enter a username or email").notEmpty(),
  body("password", "Please enter a password").notEmpty(),
];

const newGroupChatValidator = () => [
  body("name", "Please enter a group name").notEmpty(),
  body("otherMembers")
    .notEmpty()
    .withMessage("Please select at least one member")
    .isArray({ min: 1, max: 100 })
    .withMessage("Members must be 1 to 100"),
];

const addMembersValidator = () => [
  body("chatId", "Please enter a chat ID").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please select at least one member")
    .isArray({ min: 1, max: 98 })
    .withMessage("Members must be 1 to 98"),
];

const removeMembersValidator = () => [
  body("chatId", "Please enter a chat ID").notEmpty(),
  body("userId", "Please enter a user ID").notEmpty(),
];

const leaveGroupValidator = () => [
  body("chatId", "Please enter a chat ID").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "Please enter a chat ID").notEmpty(),
  check("files")
    .notEmpty()
    .withMessage("Please upload files")
    .isArray({ min: 1, max: 5 })
    .withMessage("You can upload 1 to 5 files"),
];

const idValidator = () => [param("id", "Please enter a chat ID").notEmpty()];

const renameGroupValidator = () => [
  param("id", "Please enter a chat ID").notEmpty(),
  body("name", "Please enter a group name").notEmpty(),
];

const sendRequestValidator = () => [
  body("userId", "Please enter a user ID").notEmpty(),
];

const acceptRequestValidator = () => [
  body("requestId", "Please enter a request ID").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Accept or reject is required")
    .isBoolean()
    .withMessage("Accept or reject must be a boolean"),
];

export {
  addMembersValidator,
  idValidator,
  leaveGroupValidator,
  loginValidator,
  newGroupChatValidator,
  registerValidator,
  removeMembersValidator,
  renameGroupValidator,
  sendAttachmentsValidator,
  validateHandler,
  sendRequestValidator,
  acceptRequestValidator,
};
