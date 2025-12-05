import React, { useState, useEffect } from 'react';
import { Filter, Download, Search, Calendar, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import api from '../api/axios';
import GlobalBalances from '../components/expenses/GlobalBalances';
import AddExpenseModal from '../components/expenses/AddExpenseModal';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Expense {
    _id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
    payer: {
        _id: string;
        name: string;
        avatar?: string;
    };
    shares: Array<{
        user: {
            _id: string;
            name: string;
            avatar?: string;
        };
        amount: number;
    }>;
    splitMode: string;
}

const AllExpensesPage: React.FC = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchExpenses = async () => {
        try {
            const { data } = await api.get('/expenses');
            setExpenses(data);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleExport = () => {
        const headers = ['Description', 'Amount', 'Date', 'Category', 'Payer', 'Split Mode'];
        const csvContent = [
            headers.join(','),
            ...expenses.map(e => [
                `"${e.description}"`,
                e.amount,
                new Date(e.date).toLocaleDateString(),
                e.category,
                e.payer?.name || 'Unknown',
                e.splitMode
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `expenses_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || expense.category === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Expenses</h1>
                    <p className="text-lg text-gray-500 mt-1">Track spending and settle up.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700 font-medium shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 font-bold active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Add Expense
                    </button>
                </div>
            </div>

            <AddExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onExpenseAdded={fetchExpenses}
            />

            {/* Global Balances Section */}
            {user && <GlobalBalances expenses={expenses} currentUserId={user._id} />}

            {/* Recent Activity Section */}
            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/50">
                    <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search expenses..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="bg-transparent border-none text-sm font-medium text-gray-600 focus:ring-0 cursor-pointer outline-none hover:text-primary-600 transition-colors"
                            >
                                <option value="all">All Categories</option>
                                <option value="food">Food</option>
                                <option value="transport">Transport</option>
                                <option value="accommodation">Accommodation</option>
                                <option value="activity">Activity</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100 bg-white/50">
                    {filteredExpenses.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="font-medium">No expenses found</p>
                            <p className="text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredExpenses.map((expense, index) => {
                                const isPayer = user && expense.payer._id === user._id;
                                const yourShare = expense.shares.find(s => user && s.user._id === user._id);

                                return (
                                    <motion.div
                                        key={expense._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-4 hover:bg-white transition-colors flex items-center justify-between group cursor-default"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-105
                                                    ${expense.category === 'food' ? 'bg-orange-100 text-orange-600' :
                                                        expense.category === 'transport' ? 'bg-blue-100 text-blue-600' :
                                                            expense.category === 'accommodation' ? 'bg-purple-100 text-purple-600' :
                                                                'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {expense.category === 'food' ? '🍔' :
                                                        expense.category === 'transport' ? '🚕' :
                                                            expense.category === 'accommodation' ? '🏨' : '📝'}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                    <img
                                                        src={expense.payer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(expense.payer.name)}&background=random`}
                                                        alt={expense.payer.name}
                                                        className="w-5 h-5 rounded-full border border-white"
                                                        title={`Paid by ${expense.payer.name}`}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{expense.description}</p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(expense.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-gray-100 rounded-full capitalize border border-gray-200">
                                                        {expense.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-gray-900 text-lg tracking-tight">
                                                    ${expense.amount.toFixed(2)}
                                                </span>
                                                {isPayer ? (
                                                    <span className="text-xs font-medium text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                                                        <ArrowUpRight className="w-3 h-3" />
                                                        you lent ${((expense.amount) - (yourShare?.amount || 0)).toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-medium text-red-600 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full">
                                                        <ArrowDownLeft className="w-3 h-3" />
                                                        you borrowed ${yourShare?.amount.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllExpensesPage;
