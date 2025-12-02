import React from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
                    <p className="text-gray-600">Manage your squad's schedule</p>
                </div>
                <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    Add Event
                </button>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">December 2025</h2>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                            Today
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid Placeholder */}
                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                            {day}
                        </div>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <span className="text-sm text-gray-700">{i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
                            15
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Team Meeting</h3>
                            <p className="text-sm text-gray-600">2:00 PM - 3:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
