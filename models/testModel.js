const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    subjectName: { type: String },
    mailTo: { type: String },
    marks: {
      total: { type: Number },
      gain: { type: Number },
    },
    answers: [
      {
        questionNumber: { type: String },
        questionName: { type: String },
        option_1: { type: String },
        option_2: { type: String },
        option_3: { type: String },
        option_4: { type: String },
        yourAnswer: { type: String },
        right_Answer: { type: String },
      },
    ],
    timeTaken: {
      timeMin: { type: Number },
      timeSec: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("test", testSchema);
