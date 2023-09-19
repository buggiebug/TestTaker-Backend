const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

const jwt = require("jsonwebtoken");

//  //! -------------------- Is Authenticated User --------------------
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const userToken = await req.header("userToken");
  if (!userToken) {
    return next(new ErrorHandler(401, "Please login to access this feature."));
  }
  const isValidToken = await jwt.verify(userToken, process.env.JWT_SECRET);
  req.user = await User.findById({ _id: isValidToken.id });
  next();
});


//  //! --------------------  ADMIN -------------------- 

//  //! ----------------- Is Authenticated Admin -------------------
exports.isAuthenticatedAdmin = catchAsyncErrors(async (req, res, next) => {
  const adminToken  = await req.header("adminToken");
  if (!adminToken) {
    return next(new ErrorHandler(401, "Please login to access this feature."));
  }
  const isValidToken = await jwt.verify(adminToken,"This_is_secret_key");
  req.admin = await Admin.findById({ _id: isValidToken.id });
  next();
});


//  //! ------------- Is Authorized Admin Role ----------------
exports.authorizedAdminRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      next(
        new ErrorHandler(
          401,
          `${String(req.admin.role).toUpperCase()} is not authorized.`
        )
      );
    }
    next();
  };
};

