// //!  ------------ Creating token & saving in Cookie ------------
exports.sendToken = async (user, statusCode, res) => {
  const userToken = await user.getJWTToken();
  return res.status(statusCode).json({ success: true, user, userToken });
};

// //!  ------------ Creating Admin token & saving in Cookie ------------
exports.sendAdminToken = async (admin, statusCode, res) => {
  const adminToken = await admin.generateAdminToken();
  // console.log(adminToken);
  return res.status(statusCode).json({ success: true,admin, adminToken });
};
