import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { sendEmail } from '../utils/emailService.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log('Registering user:', email);
        const userExists = await User.findOne({ email });
        console.log('User exists check done:', !!userExists);

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Creating user...');
        const user = await User.create({
            name,
            email,
            password,
        });
        console.log('User created:', user._id);

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user with Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, sub: googleId, picture } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // If user exists but doesn't have googleId, add it
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                password: '', // No password for Google users
                avatar: picture,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Forgot password - request reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({
                message: 'If an account with that email exists, we sent a password reset link.'
            });
        }

        // Check if user signed up with Google
        if (user.googleId && !user.password) {
            return res.status(400).json({
                message: 'This account uses Google Sign-In. Please sign in with Google.'
            });
        }

        // Generate reset token
        const resetToken = await PasswordReset.createToken(user._id);

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        // Send email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Squadly - Password Reset Request',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #6366f1;">Password Reset Request</h2>
                        <p>Hello ${user.name},</p>
                        <p>You requested to reset your password. Click the button below to reset it:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="color: #6366f1; word-break: break-all;">${resetUrl}</p>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #666; font-size: 12px;">This email was sent from Squadly</p>
                    </div>
                `
            });

            res.json({ message: 'Password reset email sent' });
        } catch (emailError) {
            console.error('Email send error:', emailError);
            // Still return success to prevent email enumeration
            res.json({
                message: 'If an account with that email exists, we sent a password reset link.'
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Verify token
        const resetToken = await PasswordReset.verifyToken(token);

        if (!resetToken) {
            return res.status(400).json({
                message: 'Invalid or expired reset token'
            });
        }

        // Validate password
        if (!password || password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
        }

        // Update user password
        const user = resetToken.user;
        user.password = password;
        await user.save();

        // Mark token as used
        resetToken.used = true;
        await resetToken.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify reset token is valid
// @route   GET /api/auth/reset-password/:token
// @access  Public
export const verifyResetToken = async (req, res) => {
    const { token } = req.params;

    try {
        const resetToken = await PasswordReset.verifyToken(token);

        if (!resetToken) {
            return res.status(400).json({
                valid: false,
                message: 'Invalid or expired reset token'
            });
        }

        res.json({
            valid: true,
            email: resetToken.user.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
