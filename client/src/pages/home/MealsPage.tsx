import React from 'react';
import { Plus } from 'lucide-react';

const MealsPage: React.FC = () => {
    const meals = [
        { day: 'Monday', meal: 'Spaghetti Bolognese', assignedTo: 'Manoj' },
        { day: 'Tuesday', meal: 'Chicken Stir Fry', assignedTo: 'Jamie' },
        { day: 'Wednesday', meal: 'Tacos', assignedTo: 'Alex' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Planner</h1>
                    <p className="text-gray-600">Plan your weekly meals together</p>
                </div>
                <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    Add Meal
                </button>
            </div>

            {/* Meal Calendar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">This Week's Meals</h2>
                <div className="space-y-3">
                    {meals.map((meal, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl border border-pink-100">
                            <div className="w-16 text-center">
                                <p className="text-sm font-semibold text-gray-600">{meal.day}</p>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{meal.meal}</h3>
                                <p className="text-sm text-gray-600">Cooking: {meal.assignedTo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recipe Collection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recipe Collection</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Pasta Carbonara', 'Chicken Curry', 'Veggie Stir Fry'].map((recipe, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-pink-300 cursor-pointer transition-colors">
                            <h3 className="font-semibold text-gray-900">{recipe}</h3>
                            <p className="text-sm text-gray-600 mt-1">30 mins • 4 servings</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MealsPage;
