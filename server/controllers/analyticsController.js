import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';

// @desc    Get spending by category for a trip
// @route   GET /api/analytics/trip/:tripId/by-category
// @access  Private
export const getTripSpendingByCategory = async (req, res) => {
    try {
        const { tripId } = req.params;

        const expenses = await Expense.find({ trip: tripId });

        // Aggregate by category
        const categoryTotals = expenses.reduce((acc, expense) => {
            const category = expense.category || 'other';
            acc[category] = (acc[category] || 0) + expense.amount;
            return acc;
        }, {});

        // Format for charts
        const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: parseFloat(value.toFixed(2))
        }));

        res.json(chartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get spending over time for a trip
// @route   GET /api/analytics/trip/:tripId/over-time
// @access  Private
export const getTripSpendingOverTime = async (req, res) => {
    try {
        const { tripId } = req.params;

        const expenses = await Expense.find({ trip: tripId }).sort({ date: 1 });

        // Group by date
        const dailySpending = {};
        let cumulative = 0;

        expenses.forEach(expense => {
            const date = new Date(expense.date).toISOString().split('T')[0];
            if (!dailySpending[date]) {
                dailySpending[date] = { date, daily: 0, cumulative: 0 };
            }
            dailySpending[date].daily += expense.amount;
            cumulative += expense.amount;
            dailySpending[date].cumulative = cumulative;
        });

        const chartData = Object.values(dailySpending).map(day => ({
            date: day.date,
            daily: parseFloat(day.daily.toFixed(2)),
            cumulative: parseFloat(day.cumulative.toFixed(2))
        }));

        res.json(chartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get spending by person for a trip
// @route   GET /api/analytics/trip/:tripId/by-person
// @access  Private
export const getTripSpendingByPerson = async (req, res) => {
    try {
        const { tripId } = req.params;

        const expenses = await Expense.find({ trip: tripId }).populate('payer', 'name');

        // Aggregate by payer
        const personTotals = {};

        expenses.forEach(expense => {
            const payerName = expense.payer?.name || 'Unknown';
            personTotals[payerName] = (personTotals[payerName] || 0) + expense.amount;
        });

        const chartData = Object.entries(personTotals).map(([name, value]) => ({
            name,
            amount: parseFloat(value.toFixed(2))
        }));

        res.json(chartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get expense summary stats for a trip
// @route   GET /api/analytics/trip/:tripId/summary
// @access  Private
export const getTripExpenseSummary = async (req, res) => {
    try {
        const { tripId } = req.params;

        const expenses = await Expense.find({ trip: tripId });

        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const average = expenses.length > 0 ? total / expenses.length : 0;
        const largest = expenses.length > 0
            ? Math.max(...expenses.map(e => e.amount))
            : 0;

        res.json({
            total: parseFloat(total.toFixed(2)),
            average: parseFloat(average.toFixed(2)),
            largest: parseFloat(largest.toFixed(2)),
            count: expenses.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
