import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

/**
 * GET /api/posts/:id/comments
 */
export const getCommentsByPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Post ID format.' });
    }

    const postExists = await Post.exists({ _id: id });
    if (!postExists) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comments = await Comment.find({ post: id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/posts/:id/comments
 */
export const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Post ID format.' });
    }

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    if (text.trim().length > 1000) {
      return res.status(400).json({ message: 'Comment cannot exceed 1000 characters.' });
    }

    const postExists = await Post.exists({ _id: id });
    if (!postExists) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = await Comment.create({
      text: text.trim(),
      post: id,
      author: req.user._id,
    });

    await comment.populate('author', 'name email');

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/comments/:id
 * Ownership already verified by authorizeCommentOwner middleware (attaches req.comment).
 */
export const deleteComment = async (req, res, next) => {
  try {
    await req.comment.deleteOne();

    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
