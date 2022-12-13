const QuestionsModel = require("../models/questionModels");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const SearchFeature = require("../utils/searchFeature");

//  //! ----------- New Question -----------
exports.createQuestion = catchAsyncError(async (req, res) => {
  const {
    questionCategory,
    questionType,
    questionName,
    option_1,
    option_2,
    option_3,
    option_4,
    right_Answer,
  } = req.body;
  const admin = req.admin.id;
  const questions = await QuestionsModel.create({
    questionCategory : questionCategory.charAt(0).toUpperCase() + questionCategory.slice(1),
    questionType,
    questionName,
    option_1,
    option_2,
    option_3,
    option_4,
    right_Answer,
    questionMakerId: admin,
  });
  return res.status(201).json({ success: true, questions });
});

//  //! ------------ Get all Questions ------------
exports.getAllQuestions = catchAsyncError(async (req, res, next) => {
  const searchFeature = new SearchFeature(
    QuestionsModel.find(),
    req.query
  ).filterByQuestionType();
  const questions = await searchFeature.query;

  //  Count documents by iteration...
  let questionsCount = 0;
  for(let i=0;i<questions.length;i++)
    questionsCount++;
  return res.status(200).json({ success: true, questionsCount,questions });
});

//  //! ------------ Get a Question ------------
exports.getAquestion = catchAsyncError(async (req, res, next) => {
  const questions = await QuestionsModel.findById(req.params.id);
  if (!questions) {
    return next(
      new ErrorHandler(404, `Invalid Id: ${req.params.id}, Question not found`)
    );
  }
  return res.status(200).json({ success: true, questions });
});

//  //! ------------ Update a Question ------------
exports.updateQuestion = catchAsyncError(async (req, res, next) => {
  let questions = QuestionsModel.findById(req.params.id);
  if (!questions) {
    return next(
      new ErrorHandler(404, `Invalid Id: ${req.params.id}, Question not found`)
    );
  }
  questions = await QuestionsModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  return res.status(200).json({ success: true, questions });
});

//  //! ------------ Delete a Question ------------
exports.deleteQuestion = catchAsyncError(async (req, res, next) => {
  let question = await QuestionsModel.findById(req.params.id);
  if (!question) {
    return next(
      new ErrorHandler(404, `Invalid Id: ${req.params.id}, Question not found`)
    );
  }
  await QuestionsModel.findByIdAndDelete(req.params.id);
  return res
    .status(200)
    .json({ success: true, msg: "Question Removed Successfully." });
});
