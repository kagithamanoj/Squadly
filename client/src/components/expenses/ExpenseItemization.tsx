import React from 'react';
import { Plus, Trash2, Users } from 'lucide-react';

interface LineItem {
    id: string;
    name: string;
    amount: number;
    category: 'food' | 'transport' | 'accommodation' | 'activity' | 'other';
    assignedTo: string[];
}

interface ExpenseItemizationProps {
    items: LineItem[];
    onChange: (items: LineItem[]) => void;
    travelers: any[];
}

const ExpenseItemization: React.FC<ExpenseItemizationProps> = ({ items, onChange, travelers }) => {
    const addItem = () => {
        const newItem: LineItem = {
            id: Date.now().toString(),
            name: '',
            amount: 0,
            category: 'other',
            assignedTo: []
        };
        onChange([...items, newItem]);
    };

    const updateItem = (id: string, field: keyof LineItem, value: any) => {
        onChange(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const removeItem = (id: string) => {
        onChange(items.filter(item => item.id !== id));
    };

    const toggleAssignee = (itemId: string, userId: string) => {
        const item = items.find(i => i.id === itemId);
        if (!item) return;

        const assignedTo = item.assignedTo.includes(userId)
            ? item.assignedTo.filter(id => id !== userId)
            : [...item.assignedTo, userId];

        updateItem(itemId, 'assignedTo', assignedTo);
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Line Items</h3>
                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Item
                </button>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No items yet. Click "Add Item" to start.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Item Name</label>
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                        placeholder="e.g., Pizza, Taxi, Hotel room"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        value={item.amount || ''}
                                        onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                                    <select
                                        value={item.category}
                                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm"
                                    >
                                        <option value="food">Food</option>
                                        <option value="transport">Transport</option>
                                        <option value="accommodation">Accommodation</option>
                                        <option value="activity">Activity</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Assigned To
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {travelers.map((traveler) => (
                                        <button
                                            key={traveler._id}
                                            type="button"
                                            onClick={() => toggleAssignee(item.id, traveler._id)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${item.assignedTo.includes(traveler._id)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                                                }`}
                                        >
                                            {traveler.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default ExpenseItemization;
