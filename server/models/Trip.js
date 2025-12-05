import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['flight', 'hotel', 'activity', 'food', 'transport'],
        required: true
    },
    description: { type: String, required: true },
    location: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    cost: { type: Number },
    notes: { type: String }
});

const daySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    activities: [activitySchema]
});

const tripSchema = new mongoose.Schema({
    name: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: Number },
    coverImage: { type: String },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    travelers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    itinerary: [daySchema],
    invites: [{
        email: { type: String },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    }],
    chat: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    packingList: [{
        item: { type: String, required: true },
        category: { type: String, default: 'General' },
        isChecked: { type: Boolean, default: false },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    // Trip Pass for sharing
    tripPass: {
        code: { type: String, unique: true, sparse: true },
        isActive: { type: Boolean, default: false },
        expiresAt: Date,
        permissions: {
            type: String,
            enum: ['view_only', 'add_expenses', 'full_access'],
            default: 'view_only'
        },
        usageCount: { type: Number, default: 0 },
        maxUses: Number // Optional limit on how many times pass can be used
    }
}, {
    timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
