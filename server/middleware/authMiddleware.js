import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Verifies the Bearer JWT in the Authorization header and attaches the user to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication required. Please provide a valid Bearer token.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Authentication required. Token is missing.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Account associated with this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Session expired. Please log in again.',
      });
    }

    return res.status(401).json({
      message: 'Invalid authentication token.',
    });
  }
};
