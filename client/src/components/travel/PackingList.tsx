import React, { useState } from 'react';
import { Check, Plus, Trash2, User, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

interface PackingItem {
    _id: string;
    item: string;
    category: string;
    isChecked: boolean;
    assignedTo?: {
        _id: string;
        name: string;
        avatar?: string;
    };
}

interface PackingListProps {
    tripId: string;
    items: PackingItem[];
    travelers: any[];
    onUpdate: () => void;
}

const CATEGORIES = ['General', 'Clothing', 'Toiletries', 'Electronics', 'Documents', 'Health', 'Misc'];

const PackingList: React.FC<PackingListProps> = ({ tripId, items, travelers, onUpdate }) => {
    const [newItem, setNewItem] = useState('');
    const [newCategory, setNewCategory] = useState('General');
    const [assignedTo, setAssignedTo] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        setLoading(true);
        try {
            await api.put(`/trips/${tripId}/packing`, {
                item: newItem,
                category: newCategory,
                assignedTo: assignedTo || undefined
            });
            setNewItem('');
            onUpdate();
        } catch (error) {
            console.error('Failed to add item:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleItem = async (item: PackingItem) => {
        try {
            await api.put(`/trips/${tripId}/packing`, {
                itemId: item._id,
                isChecked: !item.isChecked
            });
            onUpdate();
        } catch (error) {
            console.error('Failed to toggle item:', error);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!window.confirm('Remove this item?')) return;
        try {
            await api.delete(`/trips/${tripId}/packing/${itemId}`);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, PackingItem[]>);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Add Item Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary-600" /> Add Item
                </h3>
                <form onSubmit={handleAddItem} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="What do you need to pack?"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
                    />
                    <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none bg-white"
                    >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none bg-white"
                    >
                        <option value="">Anyone</option>
                        {travelers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                    <button
                        type="submit"
                        disabled={loading || !newItem.trim()}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-lg shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Add
                    </button>
                </form>
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                    <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-400" /> {category}
                            </h4>
                            <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                {categoryItems.filter(i => i.isChecked).length}/{categoryItems.length}
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {categoryItems.map(item => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-3 flex items-center justify-between group hover:bg-gray-50 transition-colors ${item.isChecked ? 'bg-gray-50/50' : ''}`}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <button
                                                onClick={() => handleToggleItem(item)}
                                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${item.isChecked
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'border-gray-300 hover:border-primary-500'
                                                    }`}
                                            >
                                                {item.isChecked && <Check className="w-3.5 h-3.5" />}
                                            </button>
                                            <div className={item.isChecked ? 'opacity-50 line-through' : ''}>
                                                <p className="text-gray-900 font-medium">{item.item}</p>
                                                {item.assignedTo && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <User className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">{item.assignedTo.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(item._id)}
                                            className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Packing list is empty</h3>
                    <p className="text-gray-500">Add items to make sure you don't forget anything!</p>
                </div>
            )}
        </div>
    );
};

export default PackingList;
