import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String
    },
    location: {
        type: String
    },
    category: {
        type: String,
        enum: ['Party', 'Dinner', 'Meeting', 'Other'],
        default: 'Other'
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
