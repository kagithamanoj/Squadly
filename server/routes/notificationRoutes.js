import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

router.route('/')
    .get(protect, getNotifications)
    .delete(protect, deleteAllNotifications);

router.get('/count', protect, getUnreadCount);
router.put('/read-all', protect, markAllAsRead);

router.route('/:id')
    .delete(protect, deleteNotification);

router.put('/:id/read', protect, markAsRead);

export default router;
