import React from 'react';
import { Plus, Check } from 'lucide-react';

const ShoppingPage: React.FC = () => {
    const lists = [
        {
            id: 1,
            name: 'Groceries',
            items: [
                { id: 1, name: 'Milk', checked: false },
                { id: 2, name: 'Bread', checked: true },
                { id: 3, name: 'Eggs', checked: false },
                { id: 4, name: 'Cheese', checked: false },
            ]
        },
        {
            id: 2,
            name: 'Household',
            items: [
                { id: 5, name: 'Paper Towels', checked: false },
                { id: 6, name: 'Dish Soap', checked: true },
            ]
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Lists</h1>
                    <p className="text-gray-600">Shared shopping lists for your squad</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    New List
                </button>
            </div>

            {/* Shopping Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {lists.map((list) => (
                    <div key={list.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">{list.name}</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                + Add Item
                            </button>
                        </div>
                        <div className="space-y-2">
                            {list.items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${item.checked ? 'bg-gray-50' : 'bg-blue-50'
                                        }`}
                                >
                                    <button
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${item.checked
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-gray-300 hover:border-blue-600'
                                            }`}
                                    >
                                        {item.checked && <Check className="w-3 h-3 text-white" />}
                                    </button>
                                    <span className={`flex-1 ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShoppingPage;
