import { io, Socket } from 'socket.io-client';
import { useEffect, useState, useCallback } from 'react';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

let socket: Socket | null = null;

// Initialize socket connection
export const initSocket = (token: string) => {
    if (socket?.connected) {
        return socket;
    }

    socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
        console.log('Socket connected');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
    });

    return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// Get socket instance
export const getSocket = () => socket;

// Custom hook for socket connection
export const useSocket = (token: string | null) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            disconnectSocket();
            setIsConnected(false);
            return;
        }

        const sock = initSocket(token);

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        sock.on('connect', onConnect);
        sock.on('disconnect', onDisconnect);

        // Initial state
        setIsConnected(sock.connected);

        return () => {
            sock.off('connect', onConnect);
            sock.off('disconnect', onDisconnect);
        };
    }, [token]);

    return { socket: getSocket(), isConnected };
};

// Hook for listening to specific events
export const useSocketEvent = <T>(event: string, callback: (data: T) => void) => {
    useEffect(() => {
        const sock = getSocket();
        if (!sock) return;

        sock.on(event, callback);

        return () => {
            sock.off(event, callback);
        };
    }, [event, callback]);
};

// Hook for notifications
export const useNotifications = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [latestNotification, setLatestNotification] = useState<any>(null);

    useEffect(() => {
        const sock = getSocket();
        if (!sock) return;

        const handleNewNotification = (notification: any) => {
            setLatestNotification(notification);
            setUnreadCount(prev => prev + 1);
        };

        sock.on('notification:new', handleNewNotification);

        return () => {
            sock.off('notification:new', handleNewNotification);
        };
    }, []);

    const markAsRead = useCallback(() => {
        setUnreadCount(0);
        setLatestNotification(null);
    }, []);

    return { unreadCount, setUnreadCount, latestNotification, markAsRead };
};

// Hook for trip room
export const useTripRoom = (tripId: string | null) => {
    useEffect(() => {
        const sock = getSocket();
        if (!sock || !tripId) return;

        sock.emit('join:trip', tripId);

        return () => {
            sock.emit('leave:trip', tripId);
        };
    }, [tripId]);
};

// Hook for chat messages
export const useTripChat = (tripId: string | null) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [typingUsers, setTypingUsers] = useState<any[]>([]);

    useEffect(() => {
        const sock = getSocket();
        if (!sock || !tripId) return;

        const handleNewMessage = (message: any) => {
            if (message.tripId === tripId) {
                setMessages(prev => [...prev, message]);
            }
        };

        const handleTyping = ({ tripId: msgTripId, user }: any) => {
            if (msgTripId === tripId) {
                setTypingUsers(prev => {
                    if (prev.find(u => u._id === user._id)) return prev;
                    return [...prev, user];
                });
            }
        };

        const handleStoppedTyping = ({ tripId: msgTripId, userId }: any) => {
            if (msgTripId === tripId) {
                setTypingUsers(prev => prev.filter(u => u._id !== userId));
            }
        };

        sock.on('chat:message', handleNewMessage);
        sock.on('user:typing', handleTyping);
        sock.on('user:stopped-typing', handleStoppedTyping);

        return () => {
            sock.off('chat:message', handleNewMessage);
            sock.off('user:typing', handleTyping);
            sock.off('user:stopped-typing', handleStoppedTyping);
        };
    }, [tripId]);

    const sendTypingStart = useCallback(() => {
        const sock = getSocket();
        if (sock && tripId) {
            sock.emit('typing:start', { tripId });
        }
    }, [tripId]);

    const sendTypingStop = useCallback(() => {
        const sock = getSocket();
        if (sock && tripId) {
            sock.emit('typing:stop', { tripId });
        }
    }, [tripId]);

    return { messages, setMessages, typingUsers, sendTypingStart, sendTypingStop };
};
