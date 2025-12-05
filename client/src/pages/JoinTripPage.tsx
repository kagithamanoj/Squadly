import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Loader, AlertCircle, CheckCircle } from 'lucide-react';

const JoinTripPage: React.FC = () => {
    const { passCode } = useParams<{ passCode: string }>();
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'joining' | 'success' | 'error'>('verifying');
    const [error, setError] = useState('');
    const [tripName, setTripName] = useState('');

    useEffect(() => {
        const handleJoin = async () => {
            if (!passCode) {
                setStatus('error');
                setError('Invalid invite link');
                return;
            }

            // If user is not logged in, redirect to login with return URL
            if (!loading && !user) {
                // Store the join code in localStorage to persist through auth flow
                localStorage.setItem('pendingJoinCode', passCode);
                navigate(`/login?returnUrl=/join/${passCode}`);
                return;
            }

            if (user) {
                try {
                    setStatus('joining');
                    // First verify the pass code and get trip details (optional, but good UX)
                    // For now, we'll just try to join directly

                    const { data } = await api.post(`/trips/join/${passCode}`);
                    setTripName(data.tripName || 'the trip');
                    setStatus('success');

                    // Clear any pending code
                    localStorage.removeItem('pendingJoinCode');

                    // Redirect to trip details after a short delay
                    setTimeout(() => {
                        navigate(`/travel/${data.tripId}`);
                    }, 2000);
                } catch (err: any) {
                    console.error('Join error:', err);
                    setStatus('error');
                    setError(err.response?.data?.message || 'Failed to join trip. The link may be expired or invalid.');
                }
            }
        };

        handleJoin();
    }, [passCode, user, loading, navigate]);

    if (loading || status === 'verifying' || status === 'joining') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                    >
                        <Loader className="w-12 h-12 text-blue-600" />
                    </motion.div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        {status === 'verifying' ? 'Verifying invite...' : 'Joining trip...'}
                    </h2>
                    <p className="text-gray-500 mt-2">Please wait a moment</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">You're in!</h2>
                    <p className="text-gray-600 mb-6">
                        Successfully joined <span className="font-semibold text-gray-900">{tripName}</span>.
                    </p>
                    <p className="text-sm text-gray-500">Redirecting you to the trip...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
            >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Join</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                    Go to Dashboard
                </button>
            </motion.div>
        </div>
    );
};

export default JoinTripPage;
