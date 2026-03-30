import Post from "../models/Post.js";

// @desc    Create a post for the logged-in user
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, body, status } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "Title and body are required",
      });
    }

    const allowedStatus = ["draft", "published"];
    const resolvedStatus = allowedStatus.includes(status) ? status : "draft";

    const post = await Post.create({
      title: title.trim(),
      body: body.trim(),
      status: resolvedStatus,
      author: req.user._id,
    });

    await post.populate("author", "name email");

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

// @desc    Get current user's posts with pagination
// @route   GET /api/posts?page=1&limit=5
// @access  Private
export const getMyPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const rawLimit = parseInt(String(req.query.limit), 10) || 5;
    const limit = Math.min(50, Math.max(1, rawLimit));
    const skip = (page - 1) * limit;

    const filter = { author: req.user._id };

    const [totalItems, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
