import React, { useState, useEffect } from 'react';
import { MessageCircle, UserPlus, Search, Check, X, Users } from 'lucide-react';
import api from '../api/axios';

interface User {
    _id: string;
    name: string;
    email: string;
    avatar: string;
}

interface FriendRequest {
    _id: string;
    from: User;
    status: 'pending' | 'accepted' | 'rejected';
}

const SocialPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
    const [loading, setLoading] = useState(false);

    // Fetch initial data
    useEffect(() => {
        fetchFriendRequests();
        fetchFriends();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const { data } = await api.get('/api/users/friend-requests');
            setFriendRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        }
    };

    const fetchFriends = async () => {
        try {
            const { data } = await api.get('/api/users/friends');
            setFriends(data);
        } catch (error) {
            console.error('Failed to fetch friends:', error);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.get(`/api/users/search?query=${searchQuery}`);
            setSearchResults(data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendFriendRequest = async (userId: string) => {
        try {
            await api.post(`/api/users/friend-request/${userId}`);
            alert('Friend request sent!');
            setSearchResults(prev => prev.filter(u => u._id !== userId));
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to send request');
        }
    };

    const handleRequest = async (requestId: string, action: 'accept' | 'reject') => {
        try {
            await api.put(`/api/users/friend-request/${requestId}/${action}`);
            fetchFriendRequests();
            if (action === 'accept') fetchFriends();
        } catch (error) {
            console.error(`Failed to ${action} request:`, error);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Social</h1>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('feed')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'feed' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Feed
                            </button>
                            <button
                                onClick={() => setActiveTab('friends')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'friends' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Friends
                            </button>
                        </div>
                    </div>

                    {activeTab === 'feed' ? (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center py-12">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Social Feed Coming Soon</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Connect with your squad, share trip memories, and plan your next adventure together.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Friend Requests */}
                            {friendRequests.length > 0 && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <UserPlus className="w-5 h-5 text-blue-600" />
                                        Friend Requests
                                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">{friendRequests.length}</span>
                                    </h3>
                                    <div className="space-y-4">
                                        {friendRequests.map((req) => (
                                            <div key={req._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <img src={req.from.avatar || "https://via.placeholder.com/40"} alt={req.from.name} className="w-10 h-10 rounded-full object-cover" />
                                                    <div>
                                                        <p className="font-bold text-gray-900">{req.from.name}</p>
                                                        <p className="text-xs text-gray-500">{req.from.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleRequest(req._id, 'accept')}
                                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequest(req._id, 'reject')}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Friends List */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-600" />
                                    My Friends
                                    <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">{friends.length}</span>
                                </h3>
                                {friends.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No friends yet. Search for people to add!</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {friends.map((friend) => (
                                            <div key={friend._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <img src={friend.avatar || "https://via.placeholder.com/40"} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{friend.name}</p>
                                                    <p className="text-xs text-gray-500">{friend.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar (Search) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4">Find Friends</h3>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !searchQuery.trim()}
                                className="w-full mt-3 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </form>

                        <div className="space-y-4">
                            {searchResults.map((user) => (
                                <div key={user._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar || "https://via.placeholder.com/40"} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-gray-900 truncate w-32">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate w-32">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => sendFriendRequest(user._id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Send Friend Request"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {searchResults.length === 0 && searchQuery && !loading && (
                                <p className="text-center text-sm text-gray-500">No users found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialPage;
