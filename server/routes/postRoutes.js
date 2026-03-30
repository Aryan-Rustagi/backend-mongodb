import express from "express";
import { createPost, getMyPosts } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createPost).get(getMyPosts);

export default router;
