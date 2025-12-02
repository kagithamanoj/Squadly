import React from 'react';
import { Plus } from 'lucide-react';

const EventTasksPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EventTasks</h1>
          <p className="text-gray-600">Event preparation tasks</p>
        </div>
        <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
        <p className="text-gray-500">No items yet. Get started by creating your first one!</p>
      </div>
    </div>
  );
};

export default EventTasksPage;
