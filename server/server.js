import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no origin) or any origin when CLIENT_URL is not restricted
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked origin: ${origin}`));
    },
  })
);

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'blogsphere-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required.');
    }

    await connectDB();

    app.listen(PORT, () => {
      console.log(`BlogSphere API running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
