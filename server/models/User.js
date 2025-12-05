import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false, // Password not required for Google users
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    friendRequests: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
    squadlyId: {
        type: String,
        unique: true,
    },
    userNumber: {
        type: Number,
        unique: true,
    },
    settings: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            friendRequests: { type: Boolean, default: true },
            tripUpdates: { type: Boolean, default: true },
            expenseReminders: { type: Boolean, default: true }
        },
        privacy: {
            showEmail: { type: Boolean, default: false },
            showActivity: { type: Boolean, default: true }
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        }
    }
});

// Auto-increment userNumber and generate squadlyId
userSchema.pre('save', async function () {
    if (!this.userNumber) {
        const lastUser = await this.constructor.findOne({}, {}, { sort: { 'userNumber': -1 } });
        const nextNumber = lastUser && lastUser.userNumber ? lastUser.userNumber + 1 : 1;
        this.userNumber = nextNumber;
        this.squadlyId = `Squadly${String(nextNumber).padStart(3, '0')}`;
    }
});

// Hash password before saving
userSchema.pre('save', async function () {
    console.log('Pre-save hook triggered');
    if (!this.isModified('password')) {
        console.log('Password not modified, skipping hash');
        return;
    }

    // Skip hashing if password is empty (Google users)
    if (!this.password) {
        console.log('Password empty, skipping hash');
        return;
    }

    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed');
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
