import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Receipt, Target } from 'lucide-react';
import api from '../../api/axios';

interface ExpenseAnalyticsProps {
    tripId: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const ExpenseAnalytics: React.FC<ExpenseAnalyticsProps> = ({ tripId }) => {
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [timelineData, setTimelineData] = useState<any[]>([]);
    const [personData, setPersonData] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>({ total: 0, average: 0, largest: 0, count: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [tripId]);

    const fetchAnalytics = async () => {
        try {
            const [categoryRes, timelineRes, personRes, summaryRes] = await Promise.all([
                api.get(`/analytics/trip/${tripId}/by-category`),
                api.get(`/analytics/trip/${tripId}/over-time`),
                api.get(`/analytics/trip/${tripId}/by-person`),
                api.get(`/analytics/trip/${tripId}/summary`)
            ]);

            setCategoryData(categoryRes.data);
            setTimelineData(timelineRes.data);
            setPersonData(personRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Spent</p>
                            <p className="text-2xl font-bold text-gray-900">${summary.total}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Average</p>
                            <p className="text-2xl font-bold text-gray-900">${summary.average}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Target className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Largest</p>
                            <p className="text-2xl font-bold text-gray-900">${summary.largest}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Receipt className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">{summary.count}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Pie Chart */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Spending by Category</h3>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                        if (!percent || midAngle === undefined) return null;
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                        return (
                                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        );
                                    }}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 text-center py-12">No expense data yet</p>
                    )}
                </div>

                {/* Person Bar Chart */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Spending by Person</h3>
                    {personData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={personData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 text-center py-12">No expense data yet</p>
                    )}
                </div>
            </div>

            {/* Timeline Chart */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Spending Over Time</h3>
                {timelineData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={timelineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="daily" stroke="#3B82F6" name="Daily" />
                            <Line type="monotone" dataKey="cumulative" stroke="#10B981" name="Cumulative" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-center py-12">No expense data yet</p>
                )}
            </div>
        </div>
    );
};

export default ExpenseAnalytics;
