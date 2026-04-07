import express from "express";
import { 
  createPost, 
  getPosts, 
  getPost, 
  updatePost, 
  deletePost 
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const postRoutes = (io) => {
  // Pass io to createPost controller
  router.route("/")
    .get(getPosts)
    .post(protect, (req, res) => createPost(req, res, io));

  router.route("/:id")
    .get(getPost)
    .patch(protect, (req, res) => updatePost(req, res, io))
    .delete(protect, deletePost);

  return router;
};

export default postRoutes;
