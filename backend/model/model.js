const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  name: String,
  dept: String,
  phone: String,
  role: String,
  email: String,
  password: String,
});

const userDB = mongoose.model("Accounts", schema);

module.exports = userDB;
