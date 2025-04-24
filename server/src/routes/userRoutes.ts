import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController';

const router = express.Router();

// Route to get the user profile
router.get('/profile', getUserProfile);

// Route to update the user profile
router.put('/profile', updateUserProfile);

export default router;