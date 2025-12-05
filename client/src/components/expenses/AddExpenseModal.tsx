import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, MapPin, Check } from 'lucide-react';
import api from '../../api/axios';
import ExpenseSplit from './ExpenseSplit';
import ExpenseItemization from './ExpenseItemization';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Traveler {
    _id: string;
    name: string;
    avatar?: string;
}

interface Trip {
    _id: string;
    name: string;
    travelers: Traveler[];
}

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExpenseAdded: () => void;
    tripId?: string;
    travelers?: Traveler[];
    expenseToEdit?: any;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
    isOpen,
    onClose,
    onExpenseAdded,
    tripId: initialTripId,
    travelers: initialTravelers,
    expenseToEdit
}) => {
    const { user } = useAuth();

    // Form State
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('other');
    const [selectedTripId, setSelectedTripId] = useState(initialTripId || '');

    // Split State
    const [payer, setPayer] = useState<string>('');
    const [splitMode, setSplitMode] = useState<'EVENLY' | 'BY_SHARES' | 'BY_PERCENTAGE' | 'BY_AMOUNT'>('EVENLY');
    const [shares, setShares] = useState<any[]>([]);

    // Itemization State
    const [isItemized, setIsItemized] = useState(false);
    const [lineItems, setLineItems] = useState<any[]>([]);

    // Data State
    const [trips, setTrips] = useState<Trip[]>([]);
    const [currentTravelers, setCurrentTravelers] = useState<Traveler[]>(initialTravelers || []);
    const [loading, setLoading] = useState(false);

    // Initialize payer when user loads
    useEffect(() => {
        if (user && !payer) {
            setPayer(user._id);
        }
    }, [user]);

    // Fetch trips if no tripId provided
    useEffect(() => {
        if (isOpen && !initialTripId) {
            const fetchTrips = async () => {
                try {
                    const { data } = await api.get('/trips');
                    setTrips(data);
                } catch (error) {
                    console.error('Failed to fetch trips:', error);
                }
            };
            fetchTrips();
        }
    }, [isOpen, initialTripId]);

    // Fetch travelers when trip changes (if not provided initially)
    useEffect(() => {
        if (selectedTripId && !initialTravelers) {
            const fetchTripDetails = async () => {
                try {
                    const { data } = await api.get(`/trips/${selectedTripId}`);
                    setCurrentTravelers(data.travelers);
                } catch (error) {
                    console.error('Failed to fetch trip details:', error);
                }
            };
            fetchTripDetails();
        } else if (initialTravelers) {
            setCurrentTravelers(initialTravelers);
        }
    }, [selectedTripId, initialTravelers]);

    // Reset form when opening
    useEffect(() => {
        if (isOpen) {
            if (expenseToEdit) {
                setDescription(expenseToEdit.description);
                setAmount(expenseToEdit.amount.toString());
                setDate(new Date(expenseToEdit.date).toISOString().split('T')[0]);
                setCategory(expenseToEdit.category);
                setSelectedTripId(expenseToEdit.trip);
                setPayer(expenseToEdit.payer._id);
                setSplitMode(expenseToEdit.splitMode);
                setShares(expenseToEdit.shares);
            } else {
                setDescription('');
                setAmount('');
                setDate(new Date().toISOString().split('T')[0]);
                setCategory('other');
                if (!initialTripId) setSelectedTripId('');
                if (user) setPayer(user._id);
                setSplitMode('EVENLY');
                setShares([]);
            }
        }
    }, [isOpen, expenseToEdit, initialTripId, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTripId) {
            alert('Please select a trip');
            return;
        }

        setLoading(true);

        try {
            // Calculate total from line items if itemized
            const finalAmount = isItemized
                ? lineItems.reduce((sum, item) => sum + (item.amount || 0), 0)
                : parseFloat(amount);

            const expenseData = {
                tripId: selectedTripId,
                description,
                amount: finalAmount,
                date,
                category,
                payer,
                splitMode,
                shares: shares.map(s => ({
                    ...s,
                    user: typeof s.user === 'object' ? s.user._id : s.user
                })),
                // Itemization fields
                isItemized,
                items: isItemized ? lineItems.map(item => ({
                    name: item.name,
                    amount: item.amount,
                    category: item.category,
                    assignedTo: item.assignedTo
                })) : []
            };

            if (expenseToEdit) {
                await api.put(`/expenses/${expenseToEdit._id}`, expenseData);
            } else {
                await api.post('/expenses', expenseData);
            }

            onExpenseAdded();
            onClose();
        } catch (error) {
            console.error('Failed to save expense:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {expenseToEdit ? 'Edit Expense' : 'Add Expense'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Trip Selection */}
                                {!initialTripId && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Trip</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                            <select
                                                value={selectedTripId}
                                                onChange={(e) => setSelectedTripId(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="">Select a trip</option>
                                                {trips.map(trip => (
                                                    <option key={trip._id} value={trip._id}>{trip.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Description & Amount */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                            placeholder="Dinner, Taxi, etc."
                                            required
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Date & Category */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                        <div className="relative group">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="other">Other</option>
                                                <option value="food">Food</option>
                                                <option value="transport">Transport</option>
                                                <option value="accommodation">Accommodation</option>
                                                <option value="activity">Activity</option>
                                                <option value="shopping">Shopping</option>
                                                <option value="utilities">Utilities</option>
                                                <option value="entertainment">Entertainment</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Itemization Toggle */}
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-gray-900">Itemize Expense</p>
                                        <p className="text-sm text-gray-500">Break down into line items</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsItemized(!isItemized);
                                            if (!isItemized) {
                                                setLineItems([]);
                                            }
                                        }}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isItemized ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isItemized ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Itemization Component */}
                                {isItemized && (
                                    <ExpenseItemization
                                        items={lineItems}
                                        onChange={setLineItems}
                                        travelers={currentTravelers}
                                    />
                                )}

                                {/* Payer Selection */}
                                {currentTravelers.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Paid By</label>
                                        <div className="flex flex-wrap gap-2">
                                            {currentTravelers.map(t => (
                                                <button
                                                    key={t._id}
                                                    type="button"
                                                    onClick={() => setPayer(t._id)}
                                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${payer === t._id
                                                        ? 'bg-primary-50 text-primary-700 border-primary-200 shadow-sm ring-1 ring-primary-200'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {t._id === user?._id ? 'You' : t.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Split Logic */}
                                {currentTravelers.length > 0 && amount && (
                                    <div className="border-t border-gray-100 pt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-sm font-medium text-gray-700">Split Mode</label>
                                            <select
                                                value={splitMode}
                                                onChange={(e) => setSplitMode(e.target.value as any)}
                                                className="text-sm border-none bg-gray-100 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-200 cursor-pointer font-medium text-gray-700"
                                            >
                                                <option value="EVENLY">Evenly</option>
                                                <option value="BY_AMOUNT">By Amount</option>
                                                <option value="BY_PERCENTAGE">By Percentage</option>
                                                <option value="BY_SHARES">By Shares</option>
                                            </select>
                                        </div>

                                        <ExpenseSplit
                                            amount={parseFloat(amount) || 0}
                                            travelers={currentTravelers}
                                            splitMode={splitMode}
                                            shares={shares}
                                            onSharesChange={setShares}
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !selectedTripId}
                                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </span>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            {expenseToEdit ? 'Update Expense' : 'Add Expense'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddExpenseModal;
