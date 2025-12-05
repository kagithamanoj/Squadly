import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        enum: ['food', 'transport', 'accommodation', 'activity', 'other'],
        default: 'other'
    },
    payer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    splitMode: {
        type: String,
        enum: ['EVENLY', 'BY_SHARES', 'BY_PERCENTAGE', 'BY_AMOUNT'],
        default: 'EVENLY'
    },
    shares: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        amount: Number,
        share: Number
    }],
    // Itemization support
    isItemized: {
        type: Boolean,
        default: false
    },
    items: [{
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        category: {
            type: String,
            enum: ['food', 'transport', 'accommodation', 'activity', 'other'],
            default: 'other'
        },
        assignedTo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    }],
    // Import tracking
    importSource: {
        type: String,
        enum: ['manual', 'csv', 'bank_api'],
        default: 'manual'
    },
    importMetadata: {
        fileName: String,
        importDate: Date,
        originalData: mongoose.Schema.Types.Mixed
    },
    // Split template reference
    defaultSplitTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DefaultSplit'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
