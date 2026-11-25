import { Router } from 'express';
import { deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeCommentOwner } from '../middleware/ownershipMiddleware.js';

const router = Router();

router.delete('/:id', protect, authorizeCommentOwner, deleteComment);

export default router;
