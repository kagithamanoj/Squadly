import Expense from '../models/Expense.js';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            $or: [
                { payer: req.user._id },
                { 'shares.user': req.user._id }
            ]
        })
            .populate('payer', 'name avatar')
            .populate('shares.user', 'name avatar')
            .sort({ date: -1 });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new expense
// @route   POST /api/expenses
// Create new expense
export const createExpense = async (req, res) => {
    try {
        const { tripId, description, amount, date, category, payer, splitMode, shares } = req.body;

        const expense = new Expense({
            trip: tripId,
            description,
            amount,
            date,
            category,
            payer,
            splitMode,
            shares
        });

        await expense.save();

        await expense.populate('payer', 'name avatar');
        await expense.populate('shares.user', 'name avatar');

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get expenses for a trip
export const getTripExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ trip: req.params.tripId })
            .populate('payer', 'name avatar')
            .populate('shares.user', 'name avatar')
            .sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check if user is the payer
        if (expense.payer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await expense.deleteOne();
        res.json({ message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check if user is the payer
        if (expense.payer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        expense.description = req.body.description || expense.description;
        expense.amount = req.body.amount || expense.amount;
        expense.date = req.body.date || expense.date;
        expense.splitMode = req.body.splitMode || expense.splitMode;
        expense.category = req.body.category || expense.category;
        expense.shares = req.body.shares || expense.shares;

        const updatedExpense = await expense.save();
        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
