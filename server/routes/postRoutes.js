import express from "express";
import {
  createPost,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createPost).get(getMyPosts);
router
  .route("/:id")
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

export default router;
