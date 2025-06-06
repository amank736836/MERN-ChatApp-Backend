import { body, param, validationResult } from "express-validator";
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
];

const loginValidator = () => [
  body("identifier", "Please enter a username or email").notEmpty(),
  body("password", "Please enter a password").notEmpty(),
];

const verifyValidator = () => [
  body("identifier", "Please enter a username").notEmpty(),
  body("verifyCode", "Please enter a valid verification code").notEmpty(),
];

const forgotPasswordValidator = () => [
  body("identifier", "Please enter a valid email or username").notEmpty(),
];

const updatePasswordValidator = () => [
  body("identifier", "Please enter a valid email or username").notEmpty(),
  body("password", "Please enter a password").notEmpty(),
  body("verifyCode", "Please enter a valid verification code").notEmpty(),
];

const isAcceptingMessagesValidator = () => [
  body("isAcceptingMessage")
    .isBoolean()
    .withMessage("Please enter a boolean value"),
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
  body("memberId", "Please enter a user ID").notEmpty(),
];

const leaveGroupValidator = () => [
  body("chatId", "Please enter a chat ID").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "Please enter a chat ID").notEmpty(),
];

const idValidator = () => [
  param("chatId", "Please enter a chat ID").notEmpty(),
];

const renameGroupValidator = () => [
  param("chatId", "Please enter a chat ID").notEmpty(),
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

const adminLoginValidator = () => [
  body("secretKey", "Please enter a secret key").notEmpty(),
];

export {
  acceptRequestValidator,
  addMembersValidator,
  adminLoginValidator,
  idValidator,
  leaveGroupValidator,
  loginValidator,
  newGroupChatValidator,
  registerValidator,
  removeMembersValidator,
  renameGroupValidator,
  sendAttachmentsValidator,
  sendRequestValidator,
  validateHandler,
  forgotPasswordValidator,
  isAcceptingMessagesValidator,
  updatePasswordValidator,
  verifyValidator,
};
