const mongoose = require("mongoose");

let statusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Pending", "In-progress", "Completed"],
    default: "Pending",
  },
});

let taskSchema = new mongoose.Schema({
  handler: String,
  name: String,
  duration: String,
  status: {
    type: String,
    enum: ["Pending", "In-progress", "Completed"],
    default: "Pending",
  },
});

let schema = new mongoose.Schema({
  matNo: String,
  dept: String,
  email: String,
  tasks: [taskSchema],
  job: String,
  supervisor: String,
  status: {
    type: String,
    enum: ["Pending", "In-progress", "Completed"],
    default: "Pending",
  },
});

const activeJobsDB = mongoose.model("activejobs", schema);

module.exports = activeJobsDB;
