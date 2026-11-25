import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

/**
 * Creates middleware that loads a resource by req.params.id, returns 400/404 when
 * invalid or missing, verifies req.user owns it (403 otherwise), and attaches it to req[reqKey].
 */
const createOwnershipMiddleware = (Model, resourceLabel, reqKey) => async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Invalid ${resourceLabel} ID format.` });
    }

    const resource = await Model.findById(id);

    if (!resource) {
      return res.status(404).json({ message: `${resourceLabel} not found.` });
    }

    if (resource.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: `Forbidden: you do not have permission to modify this ${resourceLabel.toLowerCase()}.`,
      });
    }

    req[reqKey] = resource;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizePostOwner = createOwnershipMiddleware(Post, 'Post', 'post');
export const authorizeCommentOwner = createOwnershipMiddleware(Comment, 'Comment', 'comment');
