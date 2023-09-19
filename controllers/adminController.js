const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const TestModel = require("../models/testModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const { sendAdminToken } = require("../utils/getJWTtoken");
const questionModels = require("../models/questionModels");

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
  const allAdminsCount = await AdminModel.countDocuments();
  const allUsersCount = await UserModel.countDocuments();
  const questionCount = await questionModels.countDocuments();
  const totalTestCount = await TestModel.countDocuments();
  let adminData;
  if(admin.role === "admin"){
    adminData = { admin, allAdminsCount, allUsersCount, questionCount,totalTestCount };
  }else{
    adminData = { admin, allAdminsCount:0, allUsersCount:0, questionCount,totalTestCount:0 };
  }
  return res.status(200).json({ success: true, adminData });
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
  const { role } = req.body;
  const { id } = req.params;
  if (!role) {
    return next(new ErrorHandler(401, "Fields can't be empty"));
  }
  if (id === req.admin.id) {
    return next(new ErrorHandler(401, "You can't update yourself"));
  }
  await AdminModel.findByIdAndUpdate(id, { role });
  const adminData = await AdminModel.findById(id);
  return res.status(200).json({ success: true, adminData,message:"Role Updated" });
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
  const allUsers = await UserModel.find({}).sort({ _id: -1 });
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
  return res
    .status(200)
    .json({ success: true, message: `${user.email}, is Deleted` });
});

// //? ---------- Test Taken ----------
exports.testTakenByUsers = catchAsyncError(async(req,res,next)=>{
  const totalTestTakenByUsers = await TestModel.find({}).sort({_id:-1}).countDocuments();
  const testTakenByUsers = await TestModel.find({}).sort({_id:-1}).select("-answers");
  return res.status(200).json({success:true,totalTestTakenByUsers,testTakenByUsers})
})

exports.viewTestTakenByUsers = catchAsyncError(async(req,res,next)=>{
  const {id} = req.params;
  if (!id) {
    return next(new ErrorHandler(400,"Invalid I'd."));
  }
  const testTakenByUsers = await TestModel.find({_id:id});
  if(!testTakenByUsers)
    return next(new ErrorHandler(401,"Invalid I'd."));
  return res.status(200).json({success:true,testTakenByUsers:testTakenByUsers[0].answers})
})
