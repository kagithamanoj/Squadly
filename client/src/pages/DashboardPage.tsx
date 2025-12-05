import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Users, ShoppingCart } from 'lucide-react';
import api from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({
        tasksDue: 0,
        totalSpent: 0,
        upcomingEvents: 0,
        shoppingItems: 0
    });
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/dashboard');
                setStats(data.stats);
                setActivity(data.activity);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-6 max-w-7xl mx-auto space-y-8"
        >
            {/* Header */}
            <motion.div variants={item} className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Dashboard</h1>
                <p className="text-xl text-gray-500 font-light">Welcome back! Here's what's happening with your squad.</p>
            </motion.div>

            {/* Quick Stats Grid (Bento Box) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div variants={item} className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-orange-200"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Clock className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{stats.tasksDue}</h3>
                        <p className="text-sm font-medium text-gray-500">Tasks Due Today</p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-green-200"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">${stats.totalSpent.toFixed(2)}</h3>
                        <p className="text-sm font-medium text-gray-500">Total Spent</p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary-200"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-6 h-6 text-primary-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{stats.upcomingEvents}</h3>
                        <p className="text-sm font-medium text-gray-500">Active Trips</p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-teal-200"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <ShoppingCart className="w-6 h-6 text-teal-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{stats.shoppingItems}</h3>
                        <p className="text-sm font-medium text-gray-500">Shopping Items</p>
                    </div>
                </motion.div>
            </div>

            {/* Activity Feed */}
            <motion.div variants={item} className="glass-card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Recent Activity</h2>
                <div className="space-y-6">
                    {activity.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No recent activity</p>
                    ) : (
                        activity.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0 group"
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${item.type === 'trip' ? 'bg-primary-50 text-primary-600' : 'bg-green-50 text-green-600'
                                    }`}>
                                    <span className="font-bold text-lg">{item.user[0]}</span>
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className="text-base text-gray-900">
                                        <span className="font-semibold">{item.user}</span> {item.action} <span className="font-semibold text-primary-600">{item.target}</span>
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1 font-medium">
                                        {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardPage;
