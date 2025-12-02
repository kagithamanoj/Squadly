import React from 'react';
import { Users, Bell, Palette, Shield } from 'lucide-react';

const SettingsPage: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your household preferences</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* Household Members */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Household Members</h2>
                    </div>
                    <div className="space-y-3">
                        {['Manoj', 'Jamie', 'Alex'].map((member, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                                        {member[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{member}</p>
                                        <p className="text-sm text-gray-600">Member</p>
                                    </div>
                                </div>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Edit
                                </button>
                            </div>
                        ))}
                        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors">
                            + Add Member
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                    </div>
                    <div className="space-y-3">
                        {['Chore Reminders', 'Expense Updates', 'Calendar Events', 'New Messages'].map((setting, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <span className="text-gray-900">{setting}</span>
                                <button className="w-12 h-6 bg-green-500 rounded-full relative">
                                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                            <Palette className="w-5 h-5 text-pink-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-orange-50 border-2 border-orange-500 rounded-xl text-center">
                            <p className="font-semibold text-gray-900">Light Mode</p>
                        </button>
                        <button className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-center">
                            <p className="font-semibold text-gray-900">Dark Mode</p>
                        </button>
                    </div>
                </div>

                {/* Privacy */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-teal-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Privacy & Security</h2>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full p-4 bg-gray-50 rounded-xl text-left text-gray-900 hover:bg-gray-100 transition-colors">
                            Change Password
                        </button>
                        <button className="w-full p-4 bg-gray-50 rounded-xl text-left text-gray-900 hover:bg-gray-100 transition-colors">
                            Privacy Policy
                        </button>
                        <button className="w-full p-4 bg-gray-50 rounded-xl text-left text-gray-900 hover:bg-gray-100 transition-colors">
                            Terms of Service
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
