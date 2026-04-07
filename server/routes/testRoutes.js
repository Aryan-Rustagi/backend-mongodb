import express from "express";
import { getTest } from "../controllers/testControllers.js";

const router = express.Router();

router.get("/", getTest);

// Deliberate error route for testing error handling
router.get("/error", (req, res, next) => {
  const error = new Error("Deliberate Test Error: Centralized Error Handler Works!");
  error.statusCode = 418; // I'm a teapot (uncommon status code for clarity)
  next(error);
});

export default router;