import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Mail, User, Calendar, Users } from 'lucide-react';

interface Friend {
    _id: string;
    name: string;
    email: string;
    avatar: string;
}

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
    squadlyId?: string;
    friends: Friend[];
    friendsCount: number;
}

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/api/users/profile');
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    if (!user || loading) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar Section */}
                    <div className="relative">
                        <img
                            src={user.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"}
                            alt={user.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-orange-50 shadow-lg"
                        />
                        <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                        <p className="text-gray-500 mb-6">Member</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email Address</p>
                                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Squadly ID</p>
                                    <p className="text-sm font-medium text-gray-900 font-mono">{profile?.squadlyId || 'Pending...'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Joined</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(profile?.createdAt || Date.now()).toLocaleDateString('en-US', {
                                            timeZone: 'America/Chicago', // CST/CDT
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Friends</p>
                                    <p className="text-sm font-medium text-gray-900">{profile?.friendsCount || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Friends List */}
            {profile?.friends && profile.friends.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">My Friends</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profile.friends.map((friend) => (
                            <div key={friend._id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <img
                                    src={friend.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
                                    alt={friend.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">{friend.name}</p>
                                    <p className="text-xs text-gray-500">{friend.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
