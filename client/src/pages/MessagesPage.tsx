import React from 'react';
import { Plus } from 'lucide-react';

const MessagesPage: React.FC = () => {
    const messages = [
        { id: 1, author: 'Manoj', content: 'Don\'t forget we have guests coming this weekend!', time: '2 hours ago', avatar: 'M', color: 'orange' },
        { id: 2, author: 'Jamie', content: 'I bought extra groceries for the weekend', time: '5 hours ago', avatar: 'J', color: 'teal' },
        { id: 3, author: 'Alex', content: 'Can someone pick up milk on the way home?', time: 'Yesterday', avatar: 'A', color: 'purple' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
                    <p className="text-gray-600">Squad communication and updates</p>
                </div>
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    New Message
                </button>
            </div>

            {/* Message Feed */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className={`w-12 h-12 rounded-full bg-${message.color}-100 flex items-center justify-center flex-shrink-0`}>
                                <span className={`text-${message.color}-600 font-semibold`}>{message.avatar}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900">{message.author}</h3>
                                    <span className="text-sm text-gray-500">{message.time}</span>
                                </div>
                                <p className="text-gray-700">{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Post Message Form */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={3}
                        placeholder="Write a message to your squad..."
                    />
                    <div className="mt-3 flex justify-end">
                        <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">
                            Post Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
