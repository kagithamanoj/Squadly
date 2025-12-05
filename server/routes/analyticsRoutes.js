import express from 'express';
import {
    getTripSpendingByCategory,
    getTripSpendingOverTime,
    getTripSpendingByPerson,
    getTripExpenseSummary
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/trip/:tripId/by-category', protect, getTripSpendingByCategory);
router.get('/trip/:tripId/over-time', protect, getTripSpendingOverTime);
router.get('/trip/:tripId/by-person', protect, getTripSpendingByPerson);
router.get('/trip/:tripId/summary', protect, getTripExpenseSummary);

export default router;
