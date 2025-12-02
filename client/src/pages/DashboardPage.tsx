import React from 'react';
import { Plus, TrendingUp, Clock, Users } from 'lucide-react';

const DashboardPage: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your squad.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">5</h3>
                    <p className="text-sm text-gray-600">Tasks Due Today</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">$45.50</h3>
                    <p className="text-sm text-gray-600">You're Owed</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">3</h3>
                    <p className="text-sm text-gray-600">Upcoming Events</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-teal-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">12</h3>
                    <p className="text-sm text-gray-600">Shopping Items</p>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-600 font-semibold">M</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900"><span className="font-semibold">Manoj</span> completed <span className="font-semibold">Kitchen Cleaning</span></p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-teal-600 font-semibold">J</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900"><span className="font-semibold">Jamie</span> added <span className="font-semibold">$32.50</span> to expenses</p>
                            <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-600 font-semibold">A</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900"><span className="font-semibold">Alex</span> posted in <span className="font-semibold">Messages</span></p>
                            <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
