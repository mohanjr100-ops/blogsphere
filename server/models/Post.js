import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required.'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long.'],
      maxlength: [150, 'Title cannot exceed 150 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Post content is required.'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters long.'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
