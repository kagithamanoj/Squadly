import mongoose from 'mongoose';
import crypto from 'crypto';

const passwordResetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Auto-delete when expired
    },
    used: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate reset token
passwordResetSchema.statics.createToken = async function (userId) {
    // Delete any existing tokens for this user
    await this.deleteMany({ user: userId });

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = new this({
        user: userId,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry
    });

    await resetToken.save();

    return token; // Return unhashed token to send via email
};

// Verify token
passwordResetSchema.statics.verifyToken = async function (token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await this.findOne({
        token: hashedToken,
        expiresAt: { $gt: new Date() },
        used: false
    }).populate('user');

    return resetToken;
};

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);
export default PasswordReset;
