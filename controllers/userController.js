const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/user");
const AppError = require("../helpers/appErrorClass");
const sendErrorMsg = require("../helpers/sendErrorMessage");
const sendResponse = require("../helpers/sendResponse");
const { generateToken } = require("../helpers/createJwtToken");
dotenv.config({ path: "config.env" });
const privateKey = process.env.SECRET;
let fileName = path.join(__dirname, "../data", "users.json");
let users = JSON.parse(fs.readFileSync(fileName, "utf-8"));

const signUpUser = (req, res, next) => {
  const { email, passHash } = req.body;

  const user = new User(email, passHash);
  users.push(user);
  fs.writeFile(fileName, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return sendErrorMsg(
        new AppError(500, "Internal Error", "Unable to complete the Request"),
        req,
        res
      );
    }
    sendResponse(201, "Signup successful", user, req, res);
  });
};

const loginUser = async (req, res, next) => {
  try {
    const result = await bcrypt.compare(
      req.body.password,
      req.currentUser.password
    );

    if (!result) {
      res.status(201).json({
        status: {
          status: "unsuccessfull",
          message: "You Entered wrong Password",
        },
      });

      return sendErrorMsg(
        new AppError(401, "unsuccessful", "You Entered wrong Password"),
        req,
        res
      );
    }

    try {
      let jwtToken = await generateToken(
        { email: req.currentUser.email },
        privateKey,
        { expiresIn: "1h" }
      );
      res.cookie("jwt", jwtToken);
      sendResponse(200, "Successful", { jwt: jwtToken }, req, res);
    } catch (err) {
      return sendErrorMsg(
        new AppError(500, "Internal Error", "Unable to complete the Request"),
        req,
        res
      );
    }
  } catch (error) {
    return sendErrorMsg(
      new AppError(500, "Internal Error", "Unable to complete the Request"),
      req,
      res
    );
  }
};

// export controllers
module.exports = { signUpUser, loginUser };
