const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const { sendAdminToken } = require("../utils/getJWTtoken");

//  //! -------------- New Admin  --------------------
exports.newAdmin = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler(401, "Fields can't be empty"));
  }
  const isExist = await AdminModel.findOne({ email: email.toLowerCase() });
  if (isExist) {
    return next(new ErrorHandler(401, `${email} already is in used`));
  }
  const newAdmin = await AdminModel.create({
    name,
    email,
    password,
  });
  const admin = await AdminModel.findById(newAdmin._id).select("-password");
  return res.status(201).json({ success: true, admin });
});

// //! --------------------- Login As Admin ----------------
exports.loginAdmin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const admin = await AdminModel.findOne({ email: email.toLowerCase() });
  if (!admin) {
    return next(new ErrorHandler(401, "Invalid Email"));
  }
  const isPasswordMatched = await admin.compareAdminPassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler(401, "Invalid Password"));
  }
  sendAdminToken(admin, 200, res);
});

// //! --------------------- Get Admin Details ---------------------
exports.getsAdminDetails = catchAsyncError(async (req, res, next) => {
  const admin = req.admin;
  return res.status(200).json({ success: true, admin });
});

//  //! ------------------- Update Admin Password -----------------
exports.updateAdminPassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const adminData = req.admin;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler(401, "Fields can't be empty"));
  }
  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler(401, "Mismatched password"));
  }
  const isPasswordMatched = await adminData.compareAdminPassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler(401, "Invalid Password"));
  }
  adminData.password = String(confirmPassword);
  const admin = await adminData.save();
  return res.status(200).json({ success: true, admin });
});

//  //! ---------------------- Sub-Admins ----------------------

// //!  ------------------- Get all Sub-Admins -------------------
exports.getAllSubAdmins = catchAsyncError(async (req, res, next) => {
  const allAdmins = await AdminModel.find({});
  return res.status(200).json({ success: true, allAdmins });
});

//  //! ----------------- Get single Sub-Admin -----------------
exports.getSingleSubAdmins = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const adminData = await AdminModel.findById({ _id: id });
  if (!adminData) {
    return next(new ErrorHandler(401, `Can't find ${id}`));
  }
  return res.status(200).json({ success: true, adminData });
});

//  //! ------------------- Update Sub-Admin Role -----------------
exports.updateAdminRole = catchAsyncError(async (req, res, next) => {
  const { newRole } = req.body;
  const { id } = req.params;
  if (!newRole) {
    return next(new ErrorHandler(401, "Fields can't be empty"));
  }
  if (id === req.admin.id) {
    return next(new ErrorHandler(401, "You can't update yourself"));
  }
  await AdminModel.findByIdAndUpdate(id, { role: newRole });
  const adminData = await AdminModel.findById(id);
  return res.status(200).json({ success: true, adminData });
});

//  //! ----------------- Delete Sub-Admin -----------------
exports.deleteSubAdmin = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const findAdmin = await AdminModel.findById({ _id: id });
  if (!findAdmin) {
    return next(new ErrorHandler(401, `Can't find ${id}`));
  }
  if (id === req.admin.id) {
    return next(new ErrorHandler(401, `You can't remove yourself`));
  }
  await findAdmin.remove();
  return res
    .status(200)
    .json({ success: true, message: `${findAdmin.email} Deleted` });
});

//  //! --------------- Users ---------------

//  //? ---------- All Users ----------
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const allUsers = await UserModel.find({});
  return res.status(200).json({ success: true, allUsers });
});

// //? ---------- Get Single User ----------
exports.getSingleUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(401, `User does not exist with Id: ${req.params.id}`)
    );
  }
  return res.status(200).json({ success: true, user });
});

// //? ---------- Delete Single User ----------
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(401, `User does not exist with Id: ${req.params.id}`)
    );
  }
  await user.remove();
  return res.status(200).json({ success: true, message: `${user.email}, is Deleted` });
});
