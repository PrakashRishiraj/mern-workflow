import express from 'express';
import { adminOnly, projectLeaderOnly, protect } from '../middlewares/authMiddleware.js';
import { deleteUser, getUserById, getUsers } from '../controllers/userController.js';
const router = express.Router();

//User Management routes
router.get('/', protect, adminOnly, getUsers); //Get all users (admin & project-leaders only)
router.get('/:id', protect, getUserById); //Get user by ID
router.delete('/:id', protect, adminOnly, deleteUser); //Delete user (admin only)

export default router;