import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const validatePostPayload = ({ title, content }) => {
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return 'Title is required and must be at least 3 characters long.';
  }

  if (title.trim().length > 150) {
    return 'Title cannot exceed 150 characters.';
  }

  if (!content || typeof content !== 'string' || content.trim().length < 10) {
    return 'Content is required and must be at least 10 characters long.';
  }

  return null;
};

/**
 * GET /api/posts?page=1&limit=6&author=<userId>&search=<term>
 */
export const getPosts = async (req, res, next) => {
  try {
    const rawPage = Number.parseInt(req.query.page, 10);
    const rawLimit = Number.parseInt(req.query.limit, 10);

    const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 6 : Math.min(rawLimit, 50);

    const filter = {};

    if (req.query.author) {
      if (!mongoose.Types.ObjectId.isValid(req.query.author)) {
        return res.status(400).json({ message: 'Invalid author ID filter.' });
      }
      filter.author = req.query.author;
    }

    if (req.query.search && typeof req.query.search === 'string' && req.query.search.trim()) {
      const searchRegex = new RegExp(escapeRegex(req.query.search.trim()), 'i');
      filter.$or = [{ title: searchRegex }, { content: searchRegex }];
    }

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalPosts / limit));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      posts,
      pagination: {
        page: currentPage,
        limit,
        totalPosts,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/posts/:id
 */
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Post ID format.' });
    }

    const post = await Post.findById(id).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/posts
 */
export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const validationError = validatePostPayload({ title, content });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: req.user._id,
    });

    await post.populate('author', 'name email');

    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/posts/:id
 * Ownership already verified by authorizePostOwner middleware (attaches req.post).
 */
export const updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const nextTitle = title !== undefined ? title : req.post.title;
    const nextContent = content !== undefined ? content : req.post.content;

    const validationError = validatePostPayload({
      title: nextTitle,
      content: nextContent,
    });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    req.post.title = nextTitle.trim();
    req.post.content = nextContent.trim();

    await req.post.save();
    await req.post.populate('author', 'name email');

    res.status(200).json({ post: req.post });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/posts/:id
 * Ownership already verified by authorizePostOwner middleware (attaches req.post).
 */
export const deletePost = async (req, res, next) => {
  try {
    await Comment.deleteMany({ post: req.post._id });
    await req.post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
