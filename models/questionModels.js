const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionCategory: {
    type: String,
    default: "random",
  },
  questionType: {
    type: String,
    default: "easy",
  },
  questionName: {
    type: String,
    required: true,
  },
  option_1: {
    type: String,
    required: true,
  },
  option_2: {
    type: String,
    required: true,
  },
  option_3: {
    type: String,
    required: true,
  },
  option_4: {
    type: String,
    required: true,
  },
  right_Answer: {
    type: String,
    required: true,
  },
  questionMakerId:{
    type : mongoose.Schema.ObjectId,
    ref : "admin",
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}),
  },
});

module.exports = mongoose.model("questions", questionSchema);