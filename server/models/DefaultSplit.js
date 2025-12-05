import mongoose from 'mongoose';

const defaultSplitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    },
    splitMode: {
        type: String,
        enum: ['EVENLY', 'BY_SHARES', 'BY_PERCENTAGE', 'BY_AMOUNT'],
        required: true
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        share: Number, // Can be share count, percentage, or fixed amount depending on splitMode
        amount: Number // Calculated amount for BY_AMOUNT mode
    }],
    description: String,
    isGlobal: {
        type: Boolean,
        default: false // If true, can be used across all trips
    }
}, {
    timestamps: true
});

const DefaultSplit = mongoose.model('DefaultSplit', defaultSplitSchema);
export default DefaultSplit;
