import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      const error = new Error("Please provide all fields (name, email, password)");
      error.statusCode = 400;
      return next(error);
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("User with this email already exists");
      error.statusCode = 400;
      return next(error);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      const error = new Error("Please provide email and password");
      error.statusCode = 400;
      return next(error);
    }

    // Check if user exists (with password)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "30d" }
    );

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get current logged-in user (from JWT)
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      error.statusCode = 400;
      error.message = "Invalid user ID format";
    }
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // If password is being updated, hash the new one
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    // Remove password from response
    updatedUser.password = undefined;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      error.statusCode = 400;
      error.message = "Invalid user ID format";
    }
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      error.statusCode = 400;
      error.message = "Invalid user ID format";
    }
    next(error);
  }
};