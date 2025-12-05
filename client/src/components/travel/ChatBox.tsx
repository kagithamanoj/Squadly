import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

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

interface ChatBoxProps {
    tripId: string;
    messages: Message[];
    onNewMessage: (message: Message) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ tripId, messages, onNewMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const { data } = await api.post(`/trips/${tripId}/chat`, { message: newMessage });
            onNewMessage(data);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Trip Chat</h3>
                <p className="text-xs text-gray-500">Discuss plans with your squad</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.sender._id === user?._id;
                    return (
                        <div key={msg._id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <div className="flex-shrink-0">
                                {msg.sender.avatar ? (
                                    <img
                                        src={msg.sender.avatar}
                                        alt={msg.sender.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="w-4 h-4 text-gray-500" />
                                    </div>
                                )}
                            </div>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                <div className={`px-4 py-2 rounded-2xl ${isMe
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-gray-100 text-gray-900 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                                <span className="text-xs text-gray-400 mt-1">
                                    {msg.sender.name} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatBox;
