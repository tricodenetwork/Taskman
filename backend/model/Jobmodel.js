const mongoose = require("mongoose");

let statusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
});

let taskSchema = new mongoose.Schema({
  handler: String,
  name: String,
  duration: String,
  statusSchema,
});

let schema = new mongoose.Schema({
  name: String,
  duration: String,
  category: String,
  tasks: [taskSchema],
  no: Number,
});

const jobDB = mongoose.model("jobs", schema);

module.exports = jobDB;
