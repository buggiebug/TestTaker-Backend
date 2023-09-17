const router = require("express").Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
  submitMyTest,
  getAllTest
} = require("../controllers/userController");

const { isAuthenticatedUser } = require("../middleware/authentication");

router.route("/new-user").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/user/password/forgot").post(forgotPassword);
router.route("/user/password/reset/:token").put(resetPassword);
router.route("/user/me").get(isAuthenticatedUser, getUserDetails);
router.route("/user/password/update").put(isAuthenticatedUser, updateUserPassword);
router.route("/user/me/update").put(isAuthenticatedUser, updateUserProfile);
router.route("/user/submit-test").post(submitMyTest);
router.route("/user/get-all-test").get(isAuthenticatedUser,getAllTest);

module.exports = router;
