import express from 'express';
import { getExpenses, createExpense, deleteExpense, updateExpense, getTripExpenses } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getExpenses);
router.post('/', protect, createExpense);
router.get('/trip/:tripId', protect, getTripExpenses);

router.route('/:id')
    .delete(protect, deleteExpense)
    .put(protect, updateExpense);

export default router;
