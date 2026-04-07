import Post from "../models/post.model.js";

/**
 * Create a new post
 * @param {Object} postData - Data for the new post
 * @returns {Promise<Object>} The created post
 */
export const createPost = async (postData) => {
  const post = await Post.create(postData);
  return await post.populate("author", "username email");
};

/**
 * Get all posts with author details
 * @param {Object} filter - Query filter
 * @param {Object} options - Pagination and sort options
 * @returns {Promise<Object>} List of posts and total count
 */
export const getAllPosts = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;

  const [total, posts] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("author", "username")
      .select("-__v"),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { 
    totalItems: total, 
    posts, 
    page, 
    limit, 
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Get a single post by ID
 * @param {string} id - Post ID
 * @returns {Promise<Object|null>} The post or null if not found
 */
export const getPostById = async (id) => {
  return await Post.findById(id).populate("author", "username email");
};

/**
 * Update a post
 * @param {string} id - Post ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} The updated post or null
 */
export const updatePost = async (id, updateData) => {
  return await Post.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("author", "username email");
};

/**
 * Delete a post
 * @param {string} id - Post ID
 * @returns {Promise<Object|null>} The deleted post or null
 */
export const deletePost = async (id) => {
  return await Post.findByIdAndDelete(id);
};
