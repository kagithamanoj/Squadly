import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Calendar, Users, DollarSign, Plus, X,
    Clock, Mail, UserPlus, MessageSquare,
    Plane, Hotel, UtensilsCrossed, MapPinned, Car,
    Edit, Trash2, Check
} from 'lucide-react';
import api from '../api/axios';
import ChatBox from '../components/travel/ChatBox';
import AddExpenseModal from '../components/expenses/AddExpenseModal';
import PackingList from '../components/travel/PackingList';
import TripMap from '../components/travel/TripMap';
import ExpenseAnalytics from '../components/expenses/ExpenseAnalytics';
import { useAuth } from '../context/AuthContext';

interface Activity {
    _id?: string;
    type: 'flight' | 'hotel' | 'activity' | 'food' | 'transport';
    description: string;
    location?: string;
    startTime?: string;
    endTime?: string;
    cost?: number;
    notes?: string;
}

interface DayItinerary {
    _id?: string;
    date: string;
    activities: Activity[];
}

interface Traveler {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        avatar?: string;
    };
    message: string;
    timestamp: string;
}

interface Trip {
    _id: string;
    name: string;
    origin: string;
    destination: string;
    startDate?: string;
    endDate?: string;
    budget?: number;
    coverImage?: string;
    createdBy: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    travelers: Traveler[];
    itinerary: DayItinerary[];
    invites: Array<{ email: string; status: string }>;
    chat: Message[];
    packingList: any[];
}

const TripDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'itinerary' | 'travelers' | 'expenses' | 'chat' | 'packing' | 'map'>('itinerary');
    const [expenseSubTab, setExpenseSubTab] = useState<'list' | 'analytics'>('list');
    const [expenses, setExpenses] = useState<any[]>([]);
    const [balances, setBalances] = useState<any[]>([]);

    // Modals
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showEditTripModal, setShowEditTripModal] = useState(false);

    // Edit States
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
    const [expenseToEdit, setExpenseToEdit] = useState<any | null>(null);

    // Activity Form states
    const [selectedDate, setSelectedDate] = useState('');
    const [activityType, setActivityType] = useState<Activity['type']>('activity');
    const [activityDescription, setActivityDescription] = useState('');
    const [activityLocation, setActivityLocation] = useState('');
    const [activityStartTime, setActivityStartTime] = useState('');
    const [activityEndTime, setActivityEndTime] = useState('');
    const [activityCost, setActivityCost] = useState('');
    const [activityNotes, setActivityNotes] = useState('');

    // Invite Form state
    const [inviteEmail, setInviteEmail] = useState('');

    // Trip Edit Form state
    const [editTripName, setEditTripName] = useState('');
    const [editTripOrigin, setEditTripOrigin] = useState('');
    const [editTripDestination, setEditTripDestination] = useState('');
    const [editTripStartDate, setEditTripStartDate] = useState('');
    const [editTripEndDate, setEditTripEndDate] = useState('');
    const [editTripBudget, setEditTripBudget] = useState('');

    const fetchTrip = async () => {
        try {
            const { data } = await api.get(`/trips/${id}`);
            setTrip(data);
            // Initialize edit form data
            setEditTripName(data.name);
            setEditTripOrigin(data.origin);
            setEditTripDestination(data.destination);
            setEditTripStartDate(data.startDate ? data.startDate.split('T')[0] : '');
            setEditTripEndDate(data.endDate ? data.endDate.split('T')[0] : '');
            setEditTripBudget(data.budget?.toString() || '');
        } catch (error) {
            console.error('Failed to fetch trip:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenses = async () => {
        try {
            const { data } = await api.get(`/expenses/trip/${id}`);
            setExpenses(data);
            calculateBalances(data);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        }
    };

    const calculateBalances = (expensesList: any[]) => {
        if (!trip) return;

        const balancesMap: Record<string, number> = {};
        trip.travelers.forEach(t => balancesMap[t._id] = 0);

        expensesList.forEach(exp => {
            const payerId = exp.payer._id;
            const amount = exp.amount;

            // Add to payer
            balancesMap[payerId] = (balancesMap[payerId] || 0) + amount;

            // Subtract from splitters
            exp.shares.forEach((share: any) => {
                const userId = share.user._id;
                balancesMap[userId] = (balancesMap[userId] || 0) - share.amount;
            });
        });

        // Calculate who owes who (simplified algorithm)
        const debtors: any[] = [];
        const creditors: any[] = [];

        Object.entries(balancesMap).forEach(([userId, amount]) => {
            if (amount < -0.01) debtors.push({ userId, amount });
            if (amount > 0.01) creditors.push({ userId, amount });
        });

        debtors.sort((a, b) => a.amount - b.amount);
        creditors.sort((a, b) => b.amount - a.amount);

        const newBalances = [];
        let i = 0;
        let j = 0;

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];
            const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

            if (amount > 0.01) {
                const debtorUser = trip.travelers.find(t => t._id === debtor.userId);
                const creditorUser = trip.travelers.find(t => t._id === creditor.userId);

                if (debtorUser && creditorUser) {
                    newBalances.push({
                        from: debtorUser,
                        to: creditorUser,
                        amount
                    });
                }
            }

            debtor.amount += amount;
            creditor.amount -= amount;

            if (Math.abs(debtor.amount) < 0.01) i++;
            if (creditor.amount < 0.01) j++;
        }

        setBalances(newBalances);
    };

    useEffect(() => {
        if (id) {
            fetchTrip();
            fetchExpenses();
        }
    }, [id]);

    useEffect(() => {
        if (trip && expenses.length > 0) {
            calculateBalances(expenses);
        }
    }, [trip]);

    // --- Trip CRUD ---

    const handleUpdateTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/trips/${id}`, {
                name: editTripName,
                origin: editTripOrigin,
                destination: editTripDestination,
                startDate: editTripStartDate,
                endDate: editTripEndDate,
                budget: editTripBudget ? parseFloat(editTripBudget) : undefined
            });
            setShowEditTripModal(false);
            fetchTrip();
            alert('Trip updated successfully!');
        } catch (error: any) {
            console.error('Failed to update trip:', error);
            alert(error.response?.data?.message || 'Failed to update trip');
        }
    };

    const handleDeleteTrip = async () => {
        if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone and will delete all associated data.')) {
            return;
        }
        try {
            await api.delete(`/trips/${id}`);
            alert('Trip deleted successfully');
            navigate('/trips'); // Redirect to trips list
        } catch (error: any) {
            console.error('Failed to delete trip:', error);
            alert(error.response?.data?.message || 'Failed to delete trip');
        }
    };

    // --- Activity CRUD ---

    const handleSaveActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const activityData = {
                date: selectedDate,
                type: activityType,
                description: activityDescription,
                location: activityLocation,
                startTime: activityStartTime,
                endTime: activityEndTime,
                cost: activityCost ? parseFloat(activityCost) : undefined,
                notes: activityNotes
            };

            if (editingActivity && editingActivity._id) {
                // Update existing activity
                await api.put(`/trips/${id}/itinerary/${editingActivity._id}`, activityData);
            } else {
                // Create new activity
                await api.post(`/trips/${id}/itinerary`, activityData);
            }

            setShowActivityModal(false);
            resetActivityForm();
            fetchTrip();
        } catch (error) {
            console.error('Failed to save activity:', error);
        }
    };

    const handleEditActivityClick = (activity: Activity, date: string) => {
        setEditingActivity(activity);
        setSelectedDate(date); // Ensure date is set correctly
        setActivityType(activity.type);
        setActivityDescription(activity.description);
        setActivityLocation(activity.location || '');
        setActivityStartTime(activity.startTime ? new Date(activity.startTime).toISOString().substring(11, 16) : '');
        setActivityEndTime(activity.endTime ? new Date(activity.endTime).toISOString().substring(11, 16) : '');
        setActivityCost(activity.cost?.toString() || '');
        setActivityNotes(activity.notes || '');
        setShowActivityModal(true);
    };

    const handleDeleteActivity = async (activityId: string) => {
        if (!trip) return;
        if (!window.confirm('Are you sure you want to delete this activity?')) return;

        try {
            await api.delete(`/trips/${trip._id}/itinerary/${activityId}`);
            fetchTrip();
        } catch (error) {
            console.error('Failed to delete activity:', error);
        }
    };

    const handleCancelInvite = async (email: string) => {
        if (!trip) return;
        if (!window.confirm(`Are you sure you want to cancel the invite for ${email}?`)) return;

        try {
            await api.delete(`/trips/${trip._id}/invite/${email}`);
            fetchTrip();
        } catch (error) {
            console.error('Failed to cancel invite:', error);
        }
    };

    // --- Expense CRUD ---

    const handleDeleteExpense = async (expenseId: string) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return;
        try {
            await api.delete(`/expenses/${expenseId}`);
            fetchExpenses();
        } catch (error: any) {
            console.error('Failed to delete expense:', error);
            alert(error.response?.data?.message || 'Failed to delete expense');
        }
    };

    const handleEditExpenseClick = (expense: any) => {
        setExpenseToEdit(expense);
        setShowExpenseModal(true);
    };

    // --- Invite ---

    const handleInviteTraveler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/trips/${id}/invite`, { email: inviteEmail });
            setShowInviteModal(false);
            setInviteEmail('');
            alert('Invitation sent successfully!');
            fetchTrip();
        } catch (error: any) {
            console.error('Failed to invite traveler:', error);
            alert(error.response?.data?.message || 'Failed to invite traveler');
        }
    };

    // --- Chat ---

    const handleNewMessage = (message: Message) => {
        if (trip) {
            setTrip({
                ...trip,
                chat: [...trip.chat, message]
            });
        }
    };

    // --- Helpers ---

    const resetActivityForm = () => {
        setEditingActivity(null);
        setActivityDescription('');
        setActivityLocation('');
        setActivityStartTime('');
        setActivityEndTime('');
        setActivityCost('');
        setActivityNotes('');
    };

    const getActivityIcon = (type: Activity['type']) => {
        switch (type) {
            case 'flight': return <Plane className="w-5 h-5" />;
            case 'hotel': return <Hotel className="w-5 h-5" />;
            case 'food': return <UtensilsCrossed className="w-5 h-5" />;
            case 'transport': return <Car className="w-5 h-5" />;
            default: return <MapPinned className="w-5 h-5" />;
        }
    };

    const getDaysBetween = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const days = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d).toISOString().split('T')[0]);
        }
        return days;
    };

    if (loading) {
        return <div className="p-6 flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    if (!trip) {
        return <div className="p-6 text-center text-gray-500">Trip not found</div>;
    }

    const tripDays = (trip.startDate && trip.endDate) ? getDaysBetween(trip.startDate, trip.endDate) : [];
    const isCreator = user && trip.createdBy._id === user._id;

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto pb-24 md:pb-6">
            {/* Header */}
            <div
                className={`rounded-2xl p-6 md:p-8 text-white mb-6 shadow-lg relative overflow-hidden ${!trip.coverImage ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : ''}`}
                style={trip.coverImage ? {
                    backgroundImage: `url(${trip.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } : {}}
            >
                {/* Dark Overlay for Image */}
                {trip.coverImage && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-0"></div>
                )}

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold drop-shadow-md">{trip.name}</h1>
                        {isCreator && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowEditTripModal(true)}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors shadow-sm border border-white/10"
                                    title="Edit Trip"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDeleteTrip}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg backdrop-blur-sm transition-colors text-red-100 shadow-sm border border-white/10"
                                    title="Delete Trip"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm md:text-base font-medium drop-shadow-md">
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                            <MapPin className="w-4 h-4" />
                            {trip.origin} → {trip.destination}
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                            <Calendar className="w-4 h-4" />
                            {trip.startDate && trip.endDate ? (
                                <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                            ) : (
                                <span className="italic">Dates TBD</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                            <Users className="w-4 h-4" />
                            {trip.travelers.length} Travelers
                        </div>
                        {trip.budget && (
                            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                                <DollarSign className="w-4 h-4" />
                                Budget: ${trip.budget}
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative circles (only if no image) */}
                {!trip.coverImage && (
                    <>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    </>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-hide">
                <button
                    onClick={() => setActiveTab('itinerary')}
                    className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'itinerary'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Itinerary
                </button>
                <button
                    onClick={() => setActiveTab('travelers')}
                    className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'travelers'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Travelers
                </button>
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'chat'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                </button>
                <button
                    onClick={() => setActiveTab('expenses')}
                    className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'expenses'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Expenses
                </button>
                <button
                    onClick={() => setActiveTab('packing')}
                    className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'packing'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Packing
                </button>
                <button
                    onClick={() => setActiveTab('map')}
                    className={`px-4 py-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'map'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <MapPinned className="w-4 h-4" />
                    Map
                </button>
            </div>

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && (
                <div className="animate-fadeIn">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Daily Itinerary</h2>
                        <button
                            onClick={() => {
                                resetActivityForm();
                                setShowActivityModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:inline">Add Activity</span>
                            <span className="md:hidden">Add</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {tripDays.map((day, index) => {
                            // Find itinerary for this specific date string
                            const dayItinerary = trip.itinerary.find(
                                i => new Date(i.date).toISOString().split('T')[0] === day
                            );

                            return (
                                <div key={day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="font-bold text-gray-900">
                                            Day {index + 1} - {new Date(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </h3>
                                    </div>
                                    <div className="p-4 md:p-6">
                                        {dayItinerary && dayItinerary.activities.length > 0 ? (
                                            <div className="space-y-4">
                                                {dayItinerary.activities.map((activity, actIdx) => (
                                                    <div key={actIdx} className="group flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors relative">
                                                        <div className={`p-3 rounded-xl flex-shrink-0 self-start ${activity.type === 'flight' ? 'bg-blue-100 text-blue-600' :
                                                            activity.type === 'hotel' ? 'bg-purple-100 text-purple-600' :
                                                                activity.type === 'food' ? 'bg-orange-100 text-orange-600' :
                                                                    activity.type === 'transport' ? 'bg-green-100 text-green-600' :
                                                                        'bg-teal-100 text-teal-600'
                                                            }`}>
                                                            {getActivityIcon(activity.type)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-semibold text-gray-900">{activity.description}</h4>
                                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => handleEditActivityClick(activity, day)}
                                                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => activity._id && handleDeleteActivity(activity._id)}
                                                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                                                {activity.location && (
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {activity.location}
                                                                    </span>
                                                                )}
                                                                {activity.startTime && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {new Date(activity.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        {activity.endTime && ` - ${new Date(activity.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                                                    </span>
                                                                )}
                                                                {activity.cost && (
                                                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                                                        <DollarSign className="w-3 h-3" />
                                                                        ${activity.cost}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {activity.notes && (
                                                                <p className="mt-2 text-sm text-gray-500 bg-white/50 p-2 rounded-lg">{activity.notes}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400 mb-2">No activities planned for this day</p>
                                                <button
                                                    onClick={() => {
                                                        setSelectedDate(day);
                                                        setShowActivityModal(true);
                                                    }}
                                                    className="text-blue-600 text-sm font-medium hover:underline"
                                                >
                                                    Add something?
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Travelers Tab */}
            {activeTab === 'travelers' && (
                <div className="animate-fadeIn">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Travelers</h2>
                        {isCreator && (
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                            >
                                <UserPlus className="w-4 h-4" />
                                Invite Traveler
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trip.travelers.map((traveler) => (
                            <div key={traveler._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={traveler.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(traveler.name)}&background=random`}
                                        alt={traveler.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{traveler.name}</p>
                                        <p className="text-sm text-gray-500">{traveler.email}</p>
                                    </div>
                                </div>
                                {trip.createdBy._id === traveler._id && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                        Admin
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {trip.invites && trip.invites.length > 0 && (
                        <div className="mt-8">
                            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Pending Invites
                            </h3>
                            <div className="space-y-2">
                                {trip.invites.map((invite, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100 group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{invite.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                                                {invite.status}
                                            </span>
                                            {trip.createdBy._id === user?._id && (
                                                <button
                                                    onClick={() => handleCancelInvite(invite.email)}
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-all"
                                                    title="Cancel Invite"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && trip && (
                <div className="max-w-3xl mx-auto h-[600px] animate-fadeIn">
                    <ChatBox
                        tripId={trip._id}
                        messages={trip.chat || []}
                        onNewMessage={handleNewMessage}
                    />
                </div>
            )}

            {/* Expenses Tab */}
            {activeTab === 'expenses' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Trip Expenses</h2>
                        <button
                            onClick={() => {
                                setExpenseToEdit(null);
                                setShowExpenseModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                        >
                            <Plus className="w-4 h-4" />
                            Add Expense
                        </button>
                    </div>

                    {/* Sub-tab Navigation */}
                    <div className="flex gap-2 border-b border-gray-200">
                        <button
                            onClick={() => setExpenseSubTab('list')}
                            className={`px-4 py-2 font-medium transition-colors ${expenseSubTab === 'list'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Expense List
                        </button>
                        <button
                            onClick={() => setExpenseSubTab('analytics')}
                            className={`px-4 py-2 font-medium transition-colors ${expenseSubTab === 'analytics'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Analytics
                        </button>
                    </div>

                    {/* Expense List View */}
                    {expenseSubTab === 'list' && (
                        <>
                            {/* Balances Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-600" /> Who owes who
                                </h3>
                                {balances.length > 0 ? (
                                    <div className="space-y-3">
                                        {balances.map((balance, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <img src={balance.from.avatar || `https://ui-avatars.com/api/?name=${balance.from.name}`} className="w-6 h-6 rounded-full" />
                                                    <span className="font-medium text-gray-700">{balance.from.name}</span>
                                                    <span className="text-gray-400 text-sm">owes</span>
                                                    <img src={balance.to.avatar || `https://ui-avatars.com/api/?name=${balance.to.name}`} className="w-6 h-6 rounded-full" />
                                                    <span className="font-medium text-gray-700">{balance.to.name}</span>
                                                </div>
                                                <span className="font-bold text-red-500">${balance.amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                                        <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                                        <p className="text-gray-500 font-medium">Everyone is settled up! 🎉</p>
                                    </div>
                                )}
                            </div>

                            {/* Expense List */}
                            <div className="space-y-4">
                                {expenses.map((expense) => (
                                    <div key={expense._id} className="group bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{expense.description}</h4>
                                                <p className="text-sm text-gray-500">
                                                    Paid by <span className="font-medium text-gray-700">{expense.payer.name}</span> • {new Date(expense.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{expense.splitMode.toLowerCase().replace('_', ' ')}</p>
                                            </div>
                                            {(user && (expense.payer._id === user._id || isCreator)) && (
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditExpenseClick(expense)}
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteExpense(expense._id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <AddExpenseModal
                                isOpen={showExpenseModal}
                                onClose={() => setShowExpenseModal(false)}
                                tripId={id!}
                                travelers={trip?.travelers || []}
                                onExpenseAdded={fetchExpenses}
                                expenseToEdit={expenseToEdit}
                            />
                        </>
                    )}

                    {/* Analytics View */}
                    {expenseSubTab === 'analytics' && trip && (
                        <ExpenseAnalytics tripId={trip._id} />
                    )}
                </div>
            )}

            {/* Packing Tab */}
            {activeTab === 'packing' && trip && (
                <PackingList
                    tripId={trip._id}
                    items={trip.packingList || []}
                    travelers={trip.travelers}
                    onUpdate={fetchTrip}
                />
            )}

            {/* Map Tab */}
            {activeTab === 'map' && trip && (
                <div className="animate-fadeIn">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Trip Map</h2>
                        <p className="text-gray-500 text-sm">Visualize all your activities and locations on the map</p>
                    </div>
                    <TripMap
                        activities={trip.itinerary.flatMap(day => day.activities)}
                        origin={trip.origin}
                        destination={trip.destination}
                    />
                </div>
            )}

            {/* Add/Edit Activity Modal */}
            {showActivityModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto animate-scaleIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{editingActivity ? 'Edit Activity' : 'Add Activity'}</h2>
                            <button onClick={() => setShowActivityModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveActivity} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <select
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    required
                                >
                                    <option value="">Select a day</option>
                                    {tripDays.map((day, idx) => (
                                        <option key={day} value={day}>
                                            Day {idx + 1} - {new Date(day).toLocaleDateString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                                <select
                                    value={activityType}
                                    onChange={(e) => setActivityType(e.target.value as Activity['type'])}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                >
                                    <option value="flight">Flight</option>
                                    <option value="hotel">Hotel</option>
                                    <option value="food">Food</option>
                                    <option value="transport">Transport</option>
                                    <option value="activity">Activity</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={activityDescription}
                                    onChange={(e) => setActivityDescription(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    placeholder="E.g., Visit Eiffel Tower"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={activityLocation}
                                    onChange={(e) => setActivityLocation(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    placeholder="Paris, France"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        value={activityStartTime}
                                        onChange={(e) => setActivityStartTime(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        value={activityEndTime}
                                        onChange={(e) => setActivityEndTime(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                                <input
                                    type="number"
                                    value={activityCost}
                                    onChange={(e) => setActivityCost(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    placeholder="50"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={activityNotes}
                                    onChange={(e) => setActivityNotes(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    rows={3}
                                    placeholder="Additional details..."
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowActivityModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-200"
                                >
                                    {editingActivity ? 'Save Changes' : 'Add Activity'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-scaleIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Invite Traveler</h2>
                            <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleInviteTraveler} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    placeholder="friend@example.com"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-200"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Trip Modal */}
            {showEditTripModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto animate-scaleIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Edit Trip</h2>
                            <button onClick={() => setShowEditTripModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateTrip} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
                                <input
                                    type="text"
                                    value={editTripName}
                                    onChange={(e) => setEditTripName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                                    <input
                                        type="text"
                                        value={editTripOrigin}
                                        onChange={(e) => setEditTripOrigin(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                                    <input
                                        type="text"
                                        value={editTripDestination}
                                        onChange={(e) => setEditTripDestination(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={editTripStartDate}
                                        onChange={(e) => setEditTripStartDate(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={editTripEndDate}
                                        onChange={(e) => setEditTripEndDate(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                                <input
                                    type="number"
                                    value={editTripBudget}
                                    onChange={(e) => setEditTripBudget(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEditTripModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-200"
                                >
                                    Update Trip
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripDetailsPage;
