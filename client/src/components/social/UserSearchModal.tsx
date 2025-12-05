import React, { useState, useEffect } from 'react';
import { Search, UserPlus, X, User as UserIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface UserSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState<string[]>([]);

    useEffect(() => {
        const searchUsers = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await api.get(`/api/users/search?query=${query}`);
                setResults(response.data);
            } catch (error) {
                console.error('Error searching users:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(searchUsers, 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const sendRequest = async (userId: string) => {
        try {
            await api.post(`/api/users/friend-request/${userId}`);
            setSentRequests(prev => [...prev, userId]);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Find Friends</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto p-4 pt-0">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="space-y-2">
                                {results.map(user => (
                                    <div key={user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <span className="text-sm">{user.name.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{user.name}</h3>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => sendRequest(user._id)}
                                            disabled={sentRequests.includes(user._id)}
                                            className={`p-2 rounded-lg transition-all ${sentRequests.includes(user._id)
                                                ? 'bg-green-100 text-green-600 cursor-default'
                                                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 hover:scale-105'
                                                }`}
                                        >
                                            {sentRequests.includes(user._id) ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <UserPlus className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : query.length >= 2 ? (
                            <div className="text-center py-8 text-gray-500">
                                No users found matching "{query}"
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 flex flex-col items-center gap-2">
                                <UserIcon className="w-12 h-12 opacity-20" />
                                <p>Type to search for people on Squadly</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UserSearchModal;
