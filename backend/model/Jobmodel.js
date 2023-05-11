const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  name: String,
  duration: String,
  category: String,
  tasks: Array,
  no: Number,
});

const jobDB = mongoose.model("jobs", schema);

module.exports = jobDB;
