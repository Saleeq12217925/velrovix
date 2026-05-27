import User from '../models/User.js';
import { generateToken } from '../utils/tokens.js';

// Helper to build the safe user object returned in responses (no password)
const buildUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email and password');
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    // Create user — password is auto-hashed by the pre-save hook in User.js
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // select('+password') overrides the default select:false on password field
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in user
 * @route   GET /api/auth/me
 * @access  Protected
 */
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user, // attached by protect middleware
  });
};

/**
 * @desc    Logout (client-side token removal — server just confirms)
 * @route   POST /api/auth/logout
 * @access  Protected
 */
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * @desc    Get all users
 * @route   GET /api/auth/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user role (admin only)
 * @route   PUT /api/auth/users/:id/role
 * @access  Admin
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['member', 'admin'].includes(role)) {
      res.status(400);
      throw new Error('Role must be member or admin');
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-password' }
    );
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
