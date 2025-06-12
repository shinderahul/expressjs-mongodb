import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// Generate JWT token
const signToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE;

  if (!secret) throw new Error("JWT_SECRET is not defined");
  if (!expiresIn) throw new Error("JWT_EXPIRE is not defined");

  return (jwt as any).sign({ id }, secret, { expiresIn }); // any will fix later
};

// Send token response
const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id.toString()); // Any will fix later

  // Remove password from user object
  user.password = undefined as any;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

// @desc            Register a new user
// @controller      POST /auth/register
// @access          Public
export const registerUser = async (req: any, res: any) => {
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Error registering user: " + error.message,
    });
  }
};

// @desc        Login user
// @controller  POST /auth/login
// @access      Public
export const loginUser = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if user exists and password is correct
    const user = (await User.findOne({ email }).select(
      "+password"
    )) as IUser | null;

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // update last login time
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: `Error logging in: ${error.message}`,
    });
  }
};

// @desc        Get current logged in user
// @controller  GET /auth/me
// @access      Private
export const getUserProfile = async (req: any, res: any) => {
  try {
    // @ts-ignore
    res.status(200).json({
      success: true,
      data: {
        user: (req as any).user, // Will fix it later
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Update user details
// @controller  PUT /auth/updatedetails
// @access      Private
export const updateUserDetails = async (req: any, res: any) => {
  try {
    const { name, email } = req.body;

    // Update user details
    const fieldsToUpdate: Partial<IUser> = {
      name,
      email,
    };

    // @ts-ignore
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Update password
// @controller  PUT /auth/updatepassword
// @access      Private
export const updateUserPassword = async (req: any, res: any) => {
  try {
    // @ts-ignore
    const user = (await User.findById(req.user.id).select(
      "+password"
    )) as IUser | null;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Register admin user (protected route - only existing admins can create new admins)
// @controller   POST /auth/register-admin
// @access  Private/Admin
export const registerAdmin = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;
    // Check if admin already exists
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Get all users (Admin only)
// @controller  GET /auth/users
// @access      Private/Admin
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: {
        users,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
