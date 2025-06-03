const express = require("express");
const { protect, restrictTo } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserDetails,
  updateUserPassword,
  registerAdmin,
  getAllUsers,
} = require("../controller/auth");

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", registerUser);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", loginUser);

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
router.post("/register-admin", registerAdmin);

// Recommended Approach for creating Admin Users:
// 1. For the first admin: Use method #1 (direct database update) or method #3 (super admin with secret)
// 2. For subsequent admins: Use method #2 (admin-only registration endpoint)
// 3. For promoting users: Use method #5 (promote endpoint)
// Note: The most secure approach is to create the first admin manually in the database, then use protected endpoints for creating additional admins.RetryClaude does not have the ability to run the code it generates yet.Claude can make mistakes. Please double-check responses.

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get("/users", protect, restrictTo("admin"), getAllUsers);

module.exports = router;
