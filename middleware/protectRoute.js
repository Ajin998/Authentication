const fs = require("fs");
const path = require("path");

const { verifyToken } = require("../helpers/verifyJwtToken");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const AppError = require("../helpers/appErrorClass");

const fileName = path.join(__dirname, "..", "data", "users.json");
const users = JSON.parse(fs.readFileSync(fileName, "utf-8"));

const protectRoute = async (req, res, next) => {
  if (!req.headers.authorization) {
    return sendErrorMessage(
      new AppError(401, "Unsuccessful", "Please login or signup"),
      req,
      res
    );
  }
  // if headers are there
  let jwtToken = req.headers.authorization.split(" ")[1];
  let payload;
  try {
    payload = await verifyToken(jwtToken, process.env.JWT_SECRET);
  } catch (err) {
    return sendErrorMessage(
      new AppError(401, "Unsuccesssul", "Invalid Token"),
      req,
      res
    );
  }

  //added alias to email
  let { email: currentUser } = users.find((user) => {
    return user.email == payload.email;
  });

  if (!currentUser) {
    return sendErrorMessage(
      new AppError(401, "Unsuccesssul", "User not registered"),
      req,
      res
    );
  }
  // check verification
  req.currentUser = currentUser;
  // give access
  next();
};
module.exports = protectRoute;
