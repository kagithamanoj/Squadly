import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    googleLogin,
    forgotPassword,
    resetPassword,
    verifyResetToken
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getUserProfile);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:token', verifyResetToken);
router.post('/reset-password/:token', resetPassword);

export default router;
