import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: [
            'friend_request',
            'friend_accepted',
            'trip_invite',
            'trip_update',
            'expense_added',
            'expense_settled',
            'event_invite',
            'event_reminder',
            'project_update',
            'task_assigned',
            'system'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        // Flexible data field for storing related IDs and metadata
        referenceId: mongoose.Schema.Types.ObjectId,
        referenceType: String, // 'Trip', 'Expense', 'Event', 'Project', 'User'
        actionUrl: String,
        extra: mongoose.Schema.Types.Mixed
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// Static method to create notifications
notificationSchema.statics.createNotification = async function (data) {
    const notification = new this(data);
    await notification.save();
    return notification;
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function (userId) {
    return this.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
    );
};

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
