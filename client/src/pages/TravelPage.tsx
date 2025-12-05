import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Users, ArrowRight, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AirportAutocomplete from '../components/travel/AirportAutocomplete';
import { motion, AnimatePresence } from 'framer-motion';

interface Trip {
    _id: string;
    name: string;
    origin: string;
    destination: string;
    startDate?: string;
    endDate?: string;
    travelers: any[];
}

const TravelPage: React.FC = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budget, setBudget] = useState('');

    const fetchTrips = async () => {
        try {
            const { data } = await api.get('/trips');
            setTrips(data);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    const handleDeleteTrip = async (tripId: string) => {
        try {
            await api.delete(`/trips/${tripId}`);
            setTrips(trips.filter(t => t._id !== tripId));
        } catch (error) {
            console.error('Failed to delete trip:', error);
            alert('Failed to delete trip. You may not be authorized.');
        }
    };

    const handleCreateTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/trips', {
                name,
                origin,
                destination,
                startDate: startDate || null,
                endDate: endDate || null,
                budget: budget ? parseFloat(budget) : 0
            });
            setIsModalOpen(false);
            fetchTrips();
            // Reset form
            setName('');
            setOrigin('');
            setDestination('');
            setStartDate('');
            setEndDate('');
            setBudget('');
        } catch (error: any) {
            console.error('Failed to create trip:', error);
            alert(error.response?.data?.message || 'Failed to create trip. Please try again.');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Travel & Adventures</h1>
                    <p className="text-gray-500 mt-1">Plan your next getaway</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 font-bold active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Plan New Trip
                </button>
            </div>

            {/* Trip List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No trips planned yet</h3>
                        <p className="text-gray-500 mt-1">Start planning your next adventure!</p>
                    </div>
                ) : (
                    trips.map((trip) => (
                        <motion.div
                            key={trip._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group"
                        >
                            <Link to={`/travel/${trip._id}`} className="block h-full">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-apple-hover transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
                                    <div className="h-40 bg-gradient-to-br from-primary-500 to-indigo-600 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="absolute bottom-4 left-4 text-white z-10">
                                            <h3 className="text-xl font-bold tracking-tight">{trip.name}</h3>
                                            <div className="flex items-center gap-2 text-sm opacity-90 mt-1 font-medium">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {trip.origin} <ArrowRight className="w-3.5 h-3.5" /> {trip.destination}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {trip.startDate && trip.endDate ? (
                                                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                                                ) : (
                                                    <span className="text-gray-400 italic">Dates TBD</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                {trip.travelers.length} Travelers
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this trip?')) {
                                        handleDeleteTrip(trip._id);
                                    }
                                }}
                                className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all z-20"
                                title="Delete Trip"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Create Trip Modal */}
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
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-900">Plan New Trip</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTrip} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Trip Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Summer Vacation 2024"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <AirportAutocomplete
                                        label="Origin"
                                        value={origin}
                                        onChange={setOrigin}
                                        placeholder="City or Airport"
                                        required
                                    />
                                    <AirportAutocomplete
                                        label="Destination"
                                        value={destination}
                                        onChange={setDestination}
                                        placeholder="City or Airport"
                                        icon={MapPin}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date <span className="text-gray-400 font-normal">(Optional)</span></label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date <span className="text-gray-400 font-normal">(Optional)</span></label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget ($)</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium group-focus-within:text-primary-500 transition-colors">$</span>
                                        <input
                                            type="number"
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                            placeholder="2000"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98] transition-all duration-200"
                                >
                                    Create Trip
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TravelPage;
