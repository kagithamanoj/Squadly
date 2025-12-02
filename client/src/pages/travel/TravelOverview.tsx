import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Map, Package, DollarSign, ArrowRight } from 'lucide-react';

const TravelOverview: React.FC = () => {
    const quickStats = [
        { label: 'Active Trips', value: '2', icon: Plane, color: 'orange' },
        { label: 'Destinations', value: '5', icon: Map, color: 'blue' },
        { label: 'Packing Lists', value: '3', icon: Package, color: 'purple' },
        { label: 'Travel Budget', value: '$2,400', icon: DollarSign, color: 'green' },
    ];

    const sections = [
        { name: 'Trips', path: '/travel/trips', icon: Plane, color: 'orange', description: 'Plan your adventures' },
        { name: 'Itineraries', path: '/travel/itineraries', icon: Map, color: 'blue', description: 'Day-by-day plans' },
        { name: 'Packing', path: '/travel/packing', icon: Package, color: 'purple', description: 'What to bring' },
        { name: 'Expenses', path: '/travel/expenses', icon: DollarSign, color: 'green', description: 'Track travel costs' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Plane className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Travel</h1>
                        <p className="text-gray-600">Plan your next adventure</p>
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

            {/* Upcoming Trips */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Trips</h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Plane className="w-8 h-8 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Beach Vacation</h3>
                            <p className="text-sm text-gray-600">Miami, FL • Dec 15-22, 2025</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">$1,200</p>
                            <p className="text-xs text-gray-500">Budget</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelOverview;
