import express from "express";
import { getTest } from "../controllers/testControllers.js";

const router = express.Router();

router.get("/", getTest);

export default router;