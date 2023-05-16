const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  keywords: String,
});

const keywords = mongoose.model("keywords", schema);

module.exports = keywords;
