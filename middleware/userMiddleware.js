const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const AppError = require("../helpers/appErrorClass");
const sendErrorMsg = require("../helpers/sendErrorMessage");
let filename = path.join(__dirname, "../data", "users.json");
const users = JSON.parse(fs.readFileSync(filename, "utf8"));

const checkRequestBody = (req, res, next) => {
    let validateArray;
    switch (req.url) {
        case "/signUp":
            validateArray = ["email", "password", "confirmPassword"];
            break;
        case "/login":
            validateArray = ["email", "password"];
            break;
        default:
            return sendErrorMsg(
                new AppError(404, "Unsuccessfull", "Invalid URL request"),
                req,
                res
            );
    }

    let result = validateArray.every((key) => {
        return req.body[key] && req.body[key].trim().length; // if space  is passed then trim and match
    });
    if (!result) {
        return sendErrorMsg(
            new AppError(400, "Unsuccessfull", "Please check the body!"),
            req,
            res
        );
    }
    next();
};

const checkConfirmPassword = (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
        return sendErrorMsg(
            new AppError(400, "Unsuccessfull", "Your Password and Confirm Password does not match!"),
            req,
            res
        );
    }
    next();
};

//For validating password we use regex for atleast 8 character and one letter one number and one special character.
const validatePassword = (req, res, next) => {
    let reg_to_match = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/; //matching password criteria
    const result = req.body.password.match(reg_to_match);
    if (!result) {
        return sendErrorMsg(
            new AppError(400, "Unsuccessfull", "Your Password and Confirm Password does not match!"),
            req,
            res
        );
    }
    next();
}

const isEmailValid = (req, res, next) => {
    let em_to_match = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // For matching the email criteria ka part
    const result = req.body.email.match(em_to_match);
    if (!result) {
        return sendErrorMsg(
            new AppError(400, "Unsuccessfull", "Check your Email Address with proper format!!"),
            req,
            res
        );
    }
    next();
};

//checking for unique email address
const isEmailUnique = (req, res, next) => {
    const cUser = users.find(user => user.email === req.body.email);
    if (cUser) {
        return sendErrorMsg(
            new AppError(400, "Unsuccessfull", "Email already in use"),
            req,
            res
        );
    }
    next();
};

//for generating hash token 
const generateHashPass = async (req, res, next) => {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    req.body.passHash = hash;
    next();
};


//for checking user registered in database
const isUserRegistered = (req, res, next) => {
    const {
        email
    } = req.body;
    const curr_user = users.find(user => {
        return user.email === email;
    });
    if (!curr_user) {
        return sendErrorMsg(
            new AppError(400, "Unsuccessfull", "Email of this user not available"),
            req,
            res
        );
    }
    req.currentUser = curr_user;
    next();
};

//exporting all the modules to

module.exports = {
    checkRequestBody,
    checkConfirmPassword,
    validatePassword,
    isEmailValid,
    isEmailUnique,
    generateHashPass,
    isUserRegistered
};