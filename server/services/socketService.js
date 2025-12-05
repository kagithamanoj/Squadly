import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.name} (${socket.user._id})`);

        // Join user's personal room for notifications
        socket.join(`user:${socket.user._id}`);

        // Join trip rooms for real-time updates
        socket.on('join:trip', (tripId) => {
            socket.join(`trip:${tripId}`);
            console.log(`${socket.user.name} joined trip room: ${tripId}`);
        });

        socket.on('leave:trip', (tripId) => {
            socket.leave(`trip:${tripId}`);
            console.log(`${socket.user.name} left trip room: ${tripId}`);
        });

        // Join project rooms
        socket.on('join:project', (projectId) => {
            socket.join(`project:${projectId}`);
        });

        socket.on('leave:project', (projectId) => {
            socket.leave(`project:${projectId}`);
        });

        // Join event rooms
        socket.on('join:event', (eventId) => {
            socket.join(`event:${eventId}`);
        });

        socket.on('leave:event', (eventId) => {
            socket.leave(`event:${eventId}`);
        });

        // Handle typing indicators for chat
        socket.on('typing:start', ({ tripId }) => {
            socket.to(`trip:${tripId}`).emit('user:typing', {
                tripId,
                user: { _id: socket.user._id, name: socket.user.name }
            });
        });

        socket.on('typing:stop', ({ tripId }) => {
            socket.to(`trip:${tripId}`).emit('user:stopped-typing', {
                tripId,
                userId: socket.user._id
            });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.name}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

// Emit to specific user
export const emitToUser = (userId, event, data) => {
    if (io) {
        io.to(`user:${userId}`).emit(event, data);
    }
};

// Emit to trip room
export const emitToTrip = (tripId, event, data) => {
    if (io) {
        io.to(`trip:${tripId}`).emit(event, data);
    }
};

// Emit to project room
export const emitToProject = (projectId, event, data) => {
    if (io) {
        io.to(`project:${projectId}`).emit(event, data);
    }
};

// Emit to event room
export const emitToEvent = (eventId, event, data) => {
    if (io) {
        io.to(`event:${eventId}`).emit(event, data);
    }
};

// Notification events
export const sendNotification = (userId, notification) => {
    emitToUser(userId, 'notification:new', notification);
};

// Trip events
export const sendTripUpdate = (tripId, data) => {
    emitToTrip(tripId, 'trip:update', data);
};

export const sendNewMessage = (tripId, message) => {
    emitToTrip(tripId, 'chat:message', message);
};

export const sendExpenseUpdate = (tripId, expense) => {
    emitToTrip(tripId, 'expense:update', expense);
};

// Project events
export const sendProjectUpdate = (projectId, data) => {
    emitToProject(projectId, 'project:update', data);
};

export const sendTaskUpdate = (projectId, task) => {
    emitToProject(projectId, 'task:update', task);
};
