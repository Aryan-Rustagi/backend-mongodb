import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// POST /api/users/register - Register a new user
router.post("/register", registerUser);

// POST /api/users/login - Login user
router.post("/login", loginUser);

// GET /api/users - Get all users
router.get("/", getAllUsers);

// GET /api/users/:id - Get single user by ID
router.get("/:id", getUserById);

// PUT /api/users/:id - Update user
router.put("/:id", updateUser);

// DELETE /api/users/:id - Delete user
router.delete("/:id", deleteUser);

export default router;