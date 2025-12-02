import React from 'react';
import { DollarSign } from 'lucide-react';

const AllExpensesPage: React.FC = () => {
    const expenses = [
        { id: 1, scenario: 'Home', description: 'Groceries', amount: 94.50, paidBy: 'Manoj', date: 'Dec 1' },
        { id: 2, scenario: 'Travel', description: 'Flight Tickets', amount: 450.00, paidBy: 'Jamie', date: 'Nov 30' },
        { id: 3, scenario: 'Events', description: 'Party Decorations', amount: 85.00, paidBy: 'Alex', date: 'Nov 28' },
        { id: 4, scenario: 'Social', description: 'Dinner Out', amount: 120.00, paidBy: 'Manoj', date: 'Nov 27' },
    ];

    const scenarioColors: Record<string, string> = {
        'Home': 'teal',
        'Travel': 'orange',
        'Events': 'purple',
        'Projects': 'indigo',
        'Social': 'pink',
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">All Expenses</h1>
                <p className="text-gray-600">View expenses across all scenarios</p>
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
                    <p className="text-3xl font-bold text-green-600">$182.50</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-700">You Owe</h3>
                    </div>
                    <p className="text-3xl font-bold text-orange-600">$95.00</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Total Spent</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">$749.50</p>
                </div>
            </div>

            {/* Expense List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Expenses</h2>
                <div className="space-y-3">
                    {expenses.map((expense) => {
                        const color = scenarioColors[expense.scenario];
                        return (
                            <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className={`px-3 py-1 rounded-lg bg-${color}-100 text-${color}-700 text-sm font-medium`}>
                                        {expense.scenario}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                                        <p className="text-sm text-gray-600">
                                            Paid by <span className="font-medium">{expense.paidBy}</span> • {expense.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AllExpensesPage;
