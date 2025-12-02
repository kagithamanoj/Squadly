import React from 'react';
import { Link } from 'react-router-dom';
import { Home, CheckSquare, ShoppingCart, UtensilsCrossed, DollarSign, ArrowRight } from 'lucide-react';

const HomeOverview: React.FC = () => {
    const quickStats = [
        { label: 'Tasks Due', value: '5', icon: CheckSquare, color: 'teal' },
        { label: 'Shopping Items', value: '12', icon: ShoppingCart, color: 'blue' },
        { label: 'Meals Planned', value: '7', icon: UtensilsCrossed, color: 'pink' },
        { label: 'Home Expenses', value: '$450', icon: DollarSign, color: 'green' },
    ];

    const sections = [
        { name: 'Chores', path: '/home/chores', icon: CheckSquare, color: 'teal', description: 'Manage household tasks' },
        { name: 'Shopping', path: '/home/shopping', icon: ShoppingCart, color: 'blue', description: 'Shared shopping lists' },
        { name: 'Meals', path: '/home/meals', icon: UtensilsCrossed, color: 'pink', description: 'Plan weekly meals' },
        { name: 'Expenses', path: '/home/expenses', icon: DollarSign, color: 'green', description: 'Track home expenses' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                        <Home className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Home</h1>
                        <p className="text-gray-600">Manage your household</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {quickStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.path}
                            to={section.path}
                            className={`group p-6 rounded-2xl bg-white border border-gray-100 hover:border-${section.color}-300 hover:shadow-md transition-all`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-xl bg-${section.color}-100 flex items-center justify-center`}>
                                    <Icon className={`w-7 h-7 text-${section.color}-600`} />
                                </div>
                                <ArrowRight className={`w-5 h-5 text-gray-400 group-hover:text-${section.color}-600 group-hover:translate-x-1 transition-all`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{section.name}</h3>
                            <p className="text-gray-600">{section.description}</p>
                        </Link>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Home Activity</h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-600 font-semibold">M</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900"><span className="font-semibold">Manoj</span> completed <span className="font-semibold">Kitchen Cleaning</span></p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeOverview;
