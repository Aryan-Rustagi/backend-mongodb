import * as postService from "../services/posts.service.js";

// @desc    Create a post for the logged-in user
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, io) => {
  try {
    const { title, body, status } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "Title and body are required",
      });
    }

    const post = await postService.createPost({
      title: title.trim(),
      body: body.trim(),
      status: status || "draft",
      author: req.user._id,
    });

    // Emit newPost event to all connected clients
    if (io) {
      io.emit("newPost", {
        message: `New post created by ${req.user.email}`,
        post: post,
      });
    }

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all posts or current user's posts
// @route   GET /api/posts
// @access  Public/Private
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    // Optional filter by author if query parameter is provided or if we want only current user's posts
    // For this checkpoint, let's get all but allow filtering
    const filter = req.query.author ? { author: req.query.author } : {};

    const { totalItems, posts, totalPages, hasNextPage, hasPrevPage } = await postService.getAllPosts(filter, { page, limit });

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        totalItems,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update post
// @route   PATCH /api/posts/:id
// @access  Private
export const updatePost = async (req, res, io) => {
  try {
    const post = await postService.getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Authorization check: Make sure logged in user is the author
    if (post.author._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "User not authorized to update this post",
      });
    }

    const updatedPost = await postService.updatePost(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Authorization check
    if (post.author._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "User not authorized to delete this post",
      });
    }

    await postService.deletePost(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
