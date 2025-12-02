import React from 'react';
import { Plus, DollarSign } from 'lucide-react';

const ExpensesPage: React.FC = () => {
    const expenses = [
        { id: 1, description: 'Groceries', amount: 94.50, paidBy: 'Manoj', date: 'Dec 1', splitWith: ['Manoj', 'Jamie', 'Alex'] },
        { id: 2, description: 'Utilities', amount: 120.00, paidBy: 'Jamie', date: 'Nov 30', splitWith: ['Manoj', 'Jamie', 'Alex'] },
        { id: 3, description: 'Internet Bill', amount: 60.00, paidBy: 'Alex', date: 'Nov 28', splitWith: ['Manoj', 'Jamie', 'Alex'] },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h1>
                    <p className="text-gray-600">Track and split household expenses</p>
                </div>
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    Add Expense
                </button>
            </div>

            {/* Balance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-700">You're Owed</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600">$45.50</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-700">You Owe</h3>
                    </div>
                    <p className="text-3xl font-bold text-orange-600">$28.00</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Total Spent</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">$274.50</p>
                </div>
            </div>

            {/* Expense List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Expenses</h2>
                <div className="space-y-3">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                                <p className="text-sm text-gray-600">
                                    Paid by <span className="font-medium">{expense.paidBy}</span> • {expense.date}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                                <p className="text-sm text-gray-600">Split {expense.splitWith.length} ways</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExpensesPage;
