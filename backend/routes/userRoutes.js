import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

router.post('/', UserController.createUser);           // Create a new user
router.get('/:user_id', UserController.getUserById);   // Get user by ID
router.get('/', UserController.getAllUsers);          // Get all users
router.put('/:user_id', UserController.updateUser);   // Update user by ID
router.delete('/:user_id', UserController.deleteUser); // Delete user by ID

export default router;
