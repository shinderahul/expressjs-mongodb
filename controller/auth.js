const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Send token response
const createSendToken = (user, statusCode, res) => {
  token = signToken(user._id);

  // Remove password from user object
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

// @desc            Register a new user
// @contoller       POST /auth/register
// @access          Public

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    createSendToken(user, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error registering user: " + error.message,
    });
  }
};

// @desc        Login user
// @controller  POST /auth/login
// @access      Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exits
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // update last login time
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Error logging in: ${error.message}`,
    });
  }
};

// @desc        Get current logged in user
// @controller  GET /auth/me
// @access      Private
const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Update user details
// @controller  PUT /auth/updatedetails
// @access      Private
const updateUserDetails = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Update user details
    const fieldsToUpdate = {
      name,
      email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Update password
// @controller  PUT /auth/updatepassword
// @access      Private
const updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check if current password is correct
    if (
      !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = req.body.newPassword;

    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Register admin user (protected route - only existing admins can create new admins)
// @controller   POST /auth/register-admin
// @access  Private/Admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("registerAdmin called", name);
    // Check if user already exists
    const existingUser = await User.findOne({ role: "admin" });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "admin already exists with this email",
      });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });
    createSendToken(user, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Get all users (Admin only)
// @controller  GET /auth/users
// @access      Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserDetails,
  updateUserPassword,
  registerAdmin,
  getAllUsers,
};
