const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const TestModel = require("../models/testModel");
const { sendToken } = require("../utils/getJWTtoken");
const { sendForgotPasswordEmail, sendMarksMail } = require("../utils/sendMail");

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//  //! ---------------- New User ----------------
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  // console.log(req.body)
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    password,
  });
  const user = await User.findById(newUser._id);
  await sendToken(user, 201, res);
});

//  //! ---------------- Login User ----------------
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler(404, "Enter email & password"));
  }
  const userPass = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!userPass) {
    return next(new ErrorHandler(401, "Invalid Email"));
  }
  const isPasswordMatched = await userPass.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler(401, "Invalid Password"));
  }
  const user = await User.findById(userPass._id);
  await sendToken(user, 200, res);
});

//  //! ------------------ Logout user ------------------
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  const { userToken } = req.cookies;
  const isValidToken = jwt.verify(userToken, process.env.JWT_SECRET);
  const user = await User.findById({ _id: isValidToken.id });

  // return res.cookie("token", null, {
  //   expires: new Date(Date.now()),
  //   httpOnly: true,
  // });

  return res.status(200).json({
    success: true,
    message: `${user.email}, Logout successfully`,
  });
});

//  //! ------------------ Send Forgot Password Mail ------------------
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  // Get ResetPassword token...
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;

  try {
    // await sendForgotPasswordEmail({
    //   email: user.email,
    //   subject: "Test-Taker reset password request",
    //   message,
    // });
    return res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully :- ${message}`,
    });

    // return res.status(201).json({ success: true, message });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(500, error.message));
  }
});

//  //! ----------------------- Reset password -----------------------
exports.resetPassword = catchAsyncError(async function (req, res, next) {
  const { password, confirmPassword } = req.body;
  if (password.length < 8 || confirmPassword.length < 8) {
    return next(
      new ErrorHandler(400, "Passwords must be at least 8 characters long")
    );
  }
  resetPasswordToken = await crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({ resetPasswordToken });
  if (!user) {
    return next(
      new ErrorHandler(400, "Reset password token is Invalid or Expired")
    );
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler(400, "Password dosen't match"));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  await sendToken(user, 200, res);
});

//  //! --------------- Get a user ---------------
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  return res.status(200).json({ success: true, user });
});

//  //! ------------- Update user password -------------
exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (
    oldPassword.length < 8 ||
    newPassword.length < 8 ||
    confirmPassword.length < 8
  ) {
    return next(
      new ErrorHandler(400, "Passwords must be at least 8 characters long")
    );
  }
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler(401, "Old passwod is incorrect"));
  }
  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler(400, "Password dosen't match"));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//  //! ----------- Update user profile -----------
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
  const newData = {
    name: req.body.name,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  return res.status(200).json({ success: true, user });
});

//  //! Save test & send to the mail...
exports.submitMyTest = catchAsyncError(async (req, res, next) => {
  const {
    subjectName,
    userMailState,
    ansState,
    timeMinState,
    timeSecState,
  } = req.body;

  let totalMarks = 0, count=0;
  const answers = [];
  await ansState.forEach((e) => {
    answers.push(e);
    if(String(e.right_Answer) === String(e.yourAnswer))
      count++;
    totalMarks++;
  });

  try {
    await TestModel.create({
      subjectName: subjectName,
      mailTo: String(userMailState).toLowerCase(),
      marks: { total: totalMarks, gain: count },
      timeTaken: { timeMin: timeMinState, timeSec: timeSecState },
      answers,
    });
    await sendMarksMail(
      subjectName,
      userMailState,
      count,
      ansState,
      timeMinState,
      timeSecState
    );
    return res
      .status(200)
      .json({ success: true, message: "You are doing well. 👌" });
  } catch (err) {
    return next(new ErrorHandler(400, err.message));
  }
});

//  //! My All tests...
exports.getAllTest = catchAsyncError(async (req, res, next) => {
  const allTests = await TestModel.find({ mailTo: req.user.email });
  return res.status(200).json({ success: true, allTests });
});
