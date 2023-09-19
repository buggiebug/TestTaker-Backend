const router = require("express").Router();

const {
  newAdmin,
  loginAdmin,
  updateAdminPassword,
  getsAdminDetails,
  getAllSubAdmins,
  getSingleSubAdmins,
  updateAdminRole,
  deleteSubAdmin,
  getAllUsers,
  getSingleUserDetails,
  deleteUser,
  testTakenByUsers,
  viewTestTakenByUsers
} = require("../controllers/adminController");

const {
  isAuthenticatedAdmin,
  authorizedAdminRoles,
} = require("../middleware/authentication");


router.route("/new-admin").post(isAuthenticatedAdmin,authorizedAdminRoles("admin"),newAdmin);
router.route("/login").post(loginAdmin);
router.route("/profile").get(isAuthenticatedAdmin, getsAdminDetails);

router
  .route("/profile/update-password")
  .put(isAuthenticatedAdmin, updateAdminPassword);

// //!  ---------- Sub-Admins ----------

//  //? Get all Sub-Admins...
router
  .route("/all-admins")
  .get(isAuthenticatedAdmin, authorizedAdminRoles("admin"), getAllSubAdmins);

//  //? Get Single Sub-Admins...
router
  .route("/all-admins/single-admin-data/:id")
  .get(isAuthenticatedAdmin, authorizedAdminRoles("admin"), getSingleSubAdmins);

//  //? Update Role...
router
  .route("/all-admins/update-role/:id")
  .put(isAuthenticatedAdmin, authorizedAdminRoles("admin"), updateAdminRole);

//  //? Delete Sub-Admin...
router
  .route("/all-admins/delete/:id")
  .delete(isAuthenticatedAdmin, authorizedAdminRoles("admin"), deleteSubAdmin);

//  //! ------------ User's -------------
//  //? -------- Get all User's --------
router
  .route("/all-users")
  .get(isAuthenticatedAdmin, authorizedAdminRoles("admin"), getAllUsers);

//  //? -------- Get a single User / Delete --------
router
  .route("/all-users/:id")
  .get(
    isAuthenticatedAdmin,
    authorizedAdminRoles("admin"),
    getSingleUserDetails
  )
  .delete(isAuthenticatedAdmin, authorizedAdminRoles("admin"), deleteUser);

//  //? -------- Test Taken By Users --------
router.route("/users/testtaken").get(isAuthenticatedAdmin, authorizedAdminRoles("admin"), testTakenByUsers);
router.route("/users/testtaken/:id").get(isAuthenticatedAdmin, authorizedAdminRoles("admin"), viewTestTakenByUsers);

module.exports = router;
