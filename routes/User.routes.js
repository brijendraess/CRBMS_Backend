import express, { Router } from "express";
import {
  updatePassword,
  changeProfilePic,
  forgetPassword,
  getAllUsers,
  getMyProfile,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  sendOTPAgain,
  updateMyProfile,
  verifyOTPForLogin,
  resetPassword,
  checkAuth,
  updateBlockStatus,
  updateUserProfile,
  softDeleteUser,
  permanentDeleteUser,
  resetPasswordAfterLoggedIn,
  updateUserSingleProfile,
  getAllActiveUsers,
  zimbraTest,
  getAllNotDeletedUsers,
  isUserAvailable,
  saveZimbraEvents,
  syncUserZimbra,
  unSyncUserZimbra,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/check-auth").get(verifyJWT, checkAuth);

// router.route("/zimbra").get(zimbraTest);

// router.route("/saveZimbraEvents").get(saveZimbraEvents);

// POST Register /api/v1/auth
router.route("/register").post(upload.single("avatar"), registerUser);

// Authentication
router.route("/login").post(loginUser);

// VerifyOTP
router.route("/verify-otp").post(verifyOTPForLogin);

// Logout
router.route("/logout").post(verifyJWT, logoutUser);

// Resend OTP
router.route("/resend-otp").post(sendOTPAgain);

// Get MyProfile
router.route("/my-profile").get(verifyJWT, getMyProfile);

// get all users
router.route("/users").get(verifyJWT, getAllUsers);

// get all not deleted users
router.route("/active/users").get(verifyJWT, getAllNotDeletedUsers);

// get all active users
router.route("/active-users").get(verifyJWT, getAllActiveUsers);

// get if user is available
router.route("/isAvailable").post(isUserAvailable);

// Update my profile
router
  .route("/update-my-profile")
  .put(verifyJWT, upload.single("profileImage"), updateMyProfile);

// Get User by id
router.route("/:id").get(verifyJWT, getUserById);

// Update User Profile
router
  .route("/update-profile/:id")
  .put(verifyJWT, upload.single("profileImage"), updateUserProfile);

  // Update User Profile
router
.route("/update-single-profile/:id")
.put(verifyJWT, upload.single("profileImage"), updateUserSingleProfile);

// Change Password by user manually
router.route("/update-password").put(verifyJWT, updatePassword);

// Change Profile Pictures
router
  .route("/change-profile-picture")
  .put(verifyJWT, upload.single("avatar"), changeProfilePic);

// Forgot Password
router.route("/forgot-password").post(forgetPassword);

// reset-password
router.route("/reset-password/:token").post(resetPassword);

// Reset password after log in through profile.
router
  .route("/profile-reset-password")
  .post(verifyJWT, resetPasswordAfterLoggedIn);

router.route("/block-status").post(updateBlockStatus);

// Soft-Delete User Profile
router.route("/soft-delete/:id").delete(softDeleteUser);

// Permanent-Delete User Profile
router.route("/permanent-delete/:id").delete(permanentDeleteUser);

// Update user for zimbra
router.route("/zimbra/sync/:id").put(syncUserZimbra);

// Unsync Zimbra
router.route("/zimbra/unsync/:id").put(unSyncUserZimbra);

export default router;
