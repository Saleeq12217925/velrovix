import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect — JWT verification guard.
 * Extracts token from "Authorization: Bearer <token>" header,
 * verifies it, fetches the user from DB, and attaches to req.user.
 * Used on any route that requires login.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized — no token provided');
    }

    // Verify signature and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB (excluding password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('Not authorized — user no longer exists');
    }

    req.user = user; // attach user to request for downstream use
    next();
  } catch (error) {
    // Handle expired or invalid token specifically
    if (error.name === 'JsonWebTokenError') {
      res.status(401);
      return next(new Error('Not authorized — invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      res.status(401);
      return next(new Error('Not authorized — token expired, please login again'));
    }
    next(error);
  }
};

/**
 * adminOnly — Role-based access guard.
 * Must be used AFTER protect middleware.
 * Only allows users with role === 'admin' to proceed.
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  res.status(403);
  next(new Error('Access denied — admin privileges required'));
};
