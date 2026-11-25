import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Comment text is required.'],
      trim: true,
      minlength: [1, 'Comment cannot be empty.'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters.'],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

commentSchema.index({ post: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
