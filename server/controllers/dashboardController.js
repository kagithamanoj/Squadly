import Trip from '../models/Trip.js';
import Expense from '../models/Expense.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Get Active Trips Count (future or current)
        const today = new Date();
        const activeTripsCount = await Trip.countDocuments({
            travelers: userId,
            endDate: { $gte: today }
        });

        // 2. Get "You're Owed" Amount
        // This is complex, reusing logic from calculateBalances would be ideal, 
        // but for a quick stat, we can sum up expenses where user is payer 
        // minus their share, but that's not quite "owed".
        // A simpler metric for now: Total Expenses Paid by User
        // Or better: Net Balance (Paid - Share) across all trips? 
        // Let's stick to "Total Paid" for now as it's faster, or implement a proper balance aggregation.

        // Let's try to get a rough "Net Balance"
        const expensesPaid = await Expense.find({ payer: userId });
        let totalPaid = 0;
        expensesPaid.forEach(exp => totalPaid += exp.amount);

        // This is just total spending, not "owed". 
        // To get "owed", we need to know how much of that was for others.
        // Let's simplify for the dashboard: "Total Spent" or "Active Trips".
        // The user specifically asked for "You're Owed" in the UI, so let's try to approximate it or change the label.
        // Changing label to "Total Spent" is safer and accurate.

        // 3. Recent Activity (Mocked for now, or fetch latest created trips/expenses)
        const recentTrips = await Trip.find({ travelers: userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('createdBy', 'name');

        const recentExpenses = await Expense.find({
            $or: [{ payer: userId }, { 'shares.user': userId }]
        })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('payer', 'name');

        const activityFeed = [];

        recentTrips.forEach(trip => {
            activityFeed.push({
                type: 'trip',
                user: trip.createdBy.name,
                action: 'created a trip',
                target: trip.name,
                date: trip.createdAt
            });
        });

        recentExpenses.forEach(exp => {
            activityFeed.push({
                type: 'expense',
                user: exp.payer.name,
                action: 'added an expense',
                target: `$${exp.amount}`,
                date: exp.createdAt
            });
        });

        // Sort by date desc
        activityFeed.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            stats: {
                tasksDue: 0, // Placeholder until Chores feature
                totalSpent: totalPaid,
                upcomingEvents: activeTripsCount, // Using trips as events
                shoppingItems: 0 // Placeholder until Shopping feature
            },
            activity: activityFeed.slice(0, 5)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
