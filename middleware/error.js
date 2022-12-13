const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // MongoDB error handling...
  if (err.name === "CastError") {
    const message = `Resource not found, Invalid ${err.path}`;
    err = new ErrorHandler(400, message);
  }

  // Mongoose Duplicate error...
  if (err.code === 11000) {
    const message = `Duplicate ,${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(400, message);
  }

  //  Wrong JWT error...
  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is Invalid, try again`;
    err = new ErrorHandler(400, message);
  }

  // JWT Expire error...
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is Expired, try again`;
    err = new ErrorHandler(400, message);
  }

  return res.status(err.statusCode).json({ success: false, message: err.message });
};
