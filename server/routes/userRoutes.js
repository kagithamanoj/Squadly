import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    getFriendRequests,
    getUserProfile,
    updateProfile,
    updatePassword,
    updateSettings,
    deleteAccount
} from '../controllers/userController.js';

const router = express.Router();

router.get('/search', protect, searchUsers);
router.post('/friend-request/:id', protect, sendFriendRequest);
router.put('/friend-request/:id/accept', protect, acceptFriendRequest);
router.put('/friend-request/:id/reject', protect, rejectFriendRequest);
router.get('/friends', protect, getFriends);
router.get('/friend-requests', protect, getFriendRequests);

// Profile & Settings routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateProfile);

router.put('/password', protect, updatePassword);
router.put('/settings', protect, updateSettings);
router.delete('/account', protect, deleteAccount);

export default router;
