import express from 'express';
import { signup, login, getMe, logout, getAllUsers, updateUserRole } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes — no token needed
router.post('/signup', signup);
router.post('/login', login);

// Protected routes — token required
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

// Admin routes
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

export default router;
