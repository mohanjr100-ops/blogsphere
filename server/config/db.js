import mongoose from 'mongoose';

/**
 * Connect to MongoDB using MONGO_URI from environment variables.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not defined.');
  }

  const conn = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
