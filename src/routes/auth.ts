import express from "express";
import { protect, restrictTo, loginLimiter } from "../middleware/auth";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserDetails,
  updateUserPassword,
  registerAdmin,
  getAllUsers,
} from "../controller/auth";

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", registerUser);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", loginLimiter, loginUser);

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, getUserProfile);

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
router.put("/updatedetails", protect, updateUserDetails);

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
router.put("/updatepassword", protect, updateUserPassword);

// @desc    Register admin user (protected route - only existing admins can create new admins)
// @route   POST /api/auth/register-admin
// @access  Private/Admin
router.post("/register-admin", protect, restrictTo("admin"), registerAdmin);

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get("/users", protect, restrictTo("admin"), getAllUsers);

export default router;
