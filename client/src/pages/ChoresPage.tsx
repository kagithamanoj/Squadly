import React from 'react';
import { Plus, CheckCircle2, Circle } from 'lucide-react';

const ChoresPage: React.FC = () => {
    const chores = [
        { id: 1, title: 'Kitchen Cleaning', assignedTo: 'Manoj', dueDate: 'Today', completed: false, color: 'orange' },
        { id: 2, title: 'Take Out Trash', assignedTo: 'Jamie', dueDate: 'Today', completed: true, color: 'teal' },
        { id: 3, title: 'Vacuum Living Room', assignedTo: 'Alex', dueDate: 'Tomorrow', completed: false, color: 'purple' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Chores</h1>
                    <p className="text-gray-600">Manage household tasks and assignments</p>
                </div>
                <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    Add Chore
                </button>
            </div>

            {/* Chore List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="space-y-3">
                    {chores.map((chore) => (
                        <div
                            key={chore.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${chore.completed
                                    ? 'bg-gray-50 border-gray-200 opacity-60'
                                    : `bg-${chore.color}-50 border-${chore.color}-100`
                                }`}
                        >
                            <button className="flex-shrink-0">
                                {chore.completed ? (
                                    <CheckCircle2 className={`w-6 h-6 text-${chore.color}-600`} />
                                ) : (
                                    <Circle className={`w-6 h-6 text-${chore.color}-400`} />
                                )}
                            </button>
                            <div className="flex-1">
                                <h3 className={`font-semibold ${chore.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {chore.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Assigned to <span className="font-medium">{chore.assignedTo}</span> • Due {chore.dueDate}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-full bg-${chore.color}-100 flex items-center justify-center`}>
                                <span className={`text-${chore.color}-600 font-semibold text-sm`}>
                                    {chore.assignedTo[0]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChoresPage;
