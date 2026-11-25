import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined.');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        message: 'Name is required and must be at least 2 characters long.',
      });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        message: 'Please provide a valid email address.',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        message: 'Password is required and must be at least 6 characters long.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = (req, res) => {
  res.status(200).json({
    user: formatUserResponse(req.user),
  });
};
