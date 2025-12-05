import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Users, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

interface EventUser {
    _id: string;
    name: string;
    avatar?: string;
}

interface Event {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    category: 'Party' | 'Dinner' | 'Meeting' | 'Other';
    description?: string;
    attendees: EventUser[];
    createdBy: EventUser;
    image: string;
}

const DEFAULT_IMAGES: Record<string, string> = {
    'Party': 'https://images.unsplash.com/photo-1519671482538-581b5db3acc6?auto=format&fit=crop&q=80&w=800',
    'Dinner': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
    'Meeting': 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    'Other': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
};

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('All');
    const [error, setError] = useState('');

    // Form State
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState<'Party' | 'Dinner' | 'Meeting' | 'Other'>('Party');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (err: any) {
            console.error('Failed to fetch events:', err);
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/events', {
                title,
                date,
                time,
                location,
                category,
                description,
                image: DEFAULT_IMAGES[category]
            });
            setEvents([data, ...events]);
            setIsModalOpen(false);
            resetForm();
        } catch (err: any) {
            console.error('Failed to create event:', err);
            setError(err.response?.data?.message || 'Failed to create event');
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            await api.delete(`/events/${eventId}`);
            setEvents(events.filter(e => e._id !== eventId));
        } catch (err: any) {
            console.error('Failed to delete event:', err);
            setError(err.response?.data?.message || 'Failed to delete event');
        }
    };

    const handleAttendEvent = async (eventId: string) => {
        try {
            const { data } = await api.post(`/events/${eventId}/attend`);
            setEvents(events.map(e => e._id === eventId ? data : e));
        } catch (err: any) {
            console.error('Failed to attend event:', err);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDate('');
        setTime('');
        setLocation('');
        setCategory('Party');
        setDescription('');
    };

    const filteredEvents = filter === 'All' ? events : events.filter(e => e.category === filter);

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Events</h1>
                    <p className="text-gray-500 mt-1">Discover and organize your social calendar</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 font-bold active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Create Event
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl">
                    {error}
                    <button onClick={() => setError('')} className="float-right font-bold">×</button>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Party', 'Dinner', 'Meeting', 'Other'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === cat
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No events yet</h3>
                    <p className="text-gray-500 mb-4">Create your first event to get started</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold"
                    >
                        Create Event
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredEvents.map((event) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-apple-hover transition-all duration-300 flex flex-col"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={event.image || DEFAULT_IMAGES[event.category]}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                        {event.category}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEvent(event._id)}
                                        className="absolute top-3 left-3 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-primary-600 font-bold text-sm mb-1">
                                                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {event.time}
                                            </p>
                                            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{event.title}</h3>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-3 pt-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4" />
                                                {event.attendees?.length || 0} going
                                            </div>
                                            <button
                                                onClick={() => handleAttendEvent(event._id)}
                                                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                                            >
                                                Join
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Create Event Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                            </div>
                            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Birthday Bash"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
                                            placeholder="123 Main St"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as any)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none bg-white"
                                    >
                                        <option value="Party">Party</option>
                                        <option value="Dinner">Dinner</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none resize-none"
                                        placeholder="Event details..."
                                        rows={3}
                                    />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setIsModalOpen(false); resetForm(); }}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-lg shadow-primary-200"
                                    >
                                        Create Event
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventsPage;
