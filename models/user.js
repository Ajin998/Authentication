const uniqid = require("uniqid");
class User {
  constructor(email, hash) {
    this.userID = uniqid();
    this.email = email;
    this.password = hash;
    this.createdOn = Date();
  }
}

module.exports = User;
