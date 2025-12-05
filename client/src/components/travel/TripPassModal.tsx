import React, { useState } from 'react';
import { X, Share2, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/axios';

interface TripPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    tripId: string;
    tripName: string;
}

const TripPassModal: React.FC<TripPassModalProps> = ({ isOpen, onClose, tripId, tripName }) => {
    const [passCode, setPassCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [permissions, setPermissions] = useState<'view_only' | 'add_expenses' | 'full_access'>('view_only');
    const [expiryDays, setExpiryDays] = useState(7);

    const generatePass = async () => {
        setLoading(true);
        try {
            const { data } = await api.post(`/trips/${tripId}/generate-pass`, {
                permissions,
                expiryDays
            });
            setPassCode(data.passCode);
        } catch (error) {
            console.error('Failed to generate pass:', error);
            alert('Failed to generate trip pass');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        const link = `${window.location.origin}/join/${passCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Share Trip
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-gray-600 mb-6">
                    Generate a shareable link for <span className="font-bold">{tripName}</span>
                </p>

                {!passCode ? (
                    <>
                        {/* Permissions */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Access Level
                            </label>
                            <select
                                value={permissions}
                                onChange={(e) => setPermissions(e.target.value as any)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                            >
                                <option value="view_only">View Only</option>
                                <option value="add_expenses">Can Add Expenses</option>
                                <option value="full_access">Full Access</option>
                            </select>
                        </div>

                        {/* Expiry */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expires In
                            </label>
                            <select
                                value={expiryDays}
                                onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                            >
                                <option value={1}>1 Day</option>
                                <option value={7}>7 Days</option>
                                <option value={30}>30 Days</option>
                                <option value={365}>1 Year</option>
                            </select>
                        </div>

                        <button
                            onClick={generatePass}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold disabled:opacity-50"
                        >
                            {loading ? 'Generating...' : 'Generate Share Link'}
                        </button>
                    </>
                ) : (
                    <>
                        {/* QR Code */}
                        <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6">
                            <div className="flex justify-center mb-4">
                                <QRCodeSVG
                                    value={`${window.location.origin}/join/${passCode}`}
                                    size={200}
                                    level="H"
                                />
                            </div>
                            <p className="text-center text-sm text-gray-500">
                                Scan to join trip
                            </p>
                        </div>

                        {/* Share Link */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Share Link
                            </label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={`${window.location.origin}/join/${passCode}`}
                                    readOnly
                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm"
                                />
                                <button
                                    onClick={copyLink}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>

                            {/* Social Share Buttons */}
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join my trip "${tripName}" on Squadly: ${window.location.origin}/join/${passCode}`)}`, '_blank')}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors font-medium text-sm"
                                >
                                    WhatsApp
                                </button>
                                <button
                                    onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/join/${passCode}`)}&text=${encodeURIComponent(`Join my trip "${tripName}" on Squadly`)}`, '_blank')}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-[#0088cc]/10 text-[#0088cc] rounded-xl hover:bg-[#0088cc]/20 transition-colors font-medium text-sm"
                                >
                                    Telegram
                                </button>
                                <button
                                    onClick={() => window.open(`mailto:?subject=${encodeURIComponent(`Join my trip: ${tripName}`)}&body=${encodeURIComponent(`Hey! I'm inviting you to join my trip "${tripName}" on Squadly.\n\nClick here to join: ${window.location.origin}/join/${passCode}`)}`, '_blank')}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                                >
                                    Email
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl">
                            <p className="text-sm text-blue-900">
                                <strong>Access:</strong> {permissions.replace('_', ' ')} •
                                <strong> Expires:</strong> {expiryDays} days
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TripPassModal;
