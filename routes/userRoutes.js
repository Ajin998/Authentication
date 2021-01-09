const express = require("express");
const { signUpUser, loginUser } = require("../controllers/userController");
const {
  checkRequestBody,
  checkConfirmPassword,
  validatePassword,
  isEmailValid,
  isEmailUnique,
  generateHashPass,
  isUserRegistered,
} = require("../middleware/userMiddleware");

const userRouter = express.Router();

//For Registering the user
userRouter
  .route("/signUp")
  .post(
    checkRequestBody,
    checkConfirmPassword,
    isEmailValid,
    isEmailUnique,
    generateHashPass,
    signUpUser
  );

// For Logging in the user ka part
userRouter.route("/login").post(checkRequestBody, isUserRegistered, loginUser);

module.exports = userRouter;
