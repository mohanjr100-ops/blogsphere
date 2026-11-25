import { Router } from 'express';
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from '../controllers/postController.js';
import { createComment, getCommentsByPost } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizePostOwner } from '../middleware/ownershipMiddleware.js';

const router = Router();

router.route('/').get(getPosts).post(protect, createPost);

router
  .route('/:id')
  .get(getPostById)
  .put(protect, authorizePostOwner, updatePost)
  .delete(protect, authorizePostOwner, deletePost);

router.route('/:id/comments').get(getCommentsByPost).post(protect, createComment);

export default router;
