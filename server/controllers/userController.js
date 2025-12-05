import User from '../models/User.js';

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
export const searchUsers = async (req, res) => {
    const { query } = req.query;
    try {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.user._id } // Exclude current user
        }).select('name email avatar');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send friend request
// @route   POST /api/users/friend-request/:id
// @access  Private
export const sendFriendRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already friends
        if (user.friends.includes(targetUser._id)) {
            return res.status(400).json({ message: 'Already friends' });
        }

        // Check if request already sent
        const existingRequest = targetUser.friendRequests.find(
            req => req.from.toString() === user._id.toString() && req.status === 'pending'
        );

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        targetUser.friendRequests.push({
            from: user._id,
            status: 'pending'
        });

        await targetUser.save();

        res.json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept friend request
// @route   PUT /api/users/friend-request/:id/accept
// @access  Private
export const acceptFriendRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const requestIndex = user.friendRequests.findIndex(
            r => r._id.toString() === req.params.id
        );

        if (requestIndex === -1) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const request = user.friendRequests[requestIndex];
        const sender = await User.findById(request.from);

        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        // Add to friends lists
        user.friends.push(sender._id);
        sender.friends.push(user._id);

        // Update request status
        user.friendRequests[requestIndex].status = 'accepted';

        // Remove the request from the array (optional, or keep history)
        user.friendRequests.splice(requestIndex, 1);

        await user.save();
        await sender.save();

        res.json({ message: 'Friend request accepted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject friend request
// @route   PUT /api/users/friend-request/:id/reject
// @access  Private
export const rejectFriendRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const requestIndex = user.friendRequests.findIndex(
            r => r._id.toString() === req.params.id
        );

        if (requestIndex === -1) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Remove the request
        user.friendRequests.splice(requestIndex, 1);

        await user.save();

        res.json({ message: 'Friend request rejected' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get friends list
// @route   GET /api/users/friends
// @access  Private
export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friends', 'name email avatar');
        res.json(user.friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get friend requests
// @route   GET /api/users/friend-requests
// @access  Private
export const getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friendRequests.from', 'name email avatar');
        const pendingRequests = user.friendRequests.filter(req => req.status === 'pending');
        res.json(pendingRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile stats
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('friends', 'name email avatar');

        res.json({
            ...user.toObject(),
            friendsCount: user.friends.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, avatar, email } = req.body;

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }

        if (name) user.name = name;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            squadlyId: user.squadlyId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { currentPassword, newPassword } = req.body;

        // Check if user has a password (not Google OAuth user)
        if (!user.password) {
            return res.status(400).json({
                message: 'Cannot change password for Google sign-in accounts'
            });
        }

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters'
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
export const updateSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { notifications, privacy, theme } = req.body;

        // Add settings field if doesn't exist
        if (!user.settings) {
            user.settings = {};
        }

        if (notifications !== undefined) user.settings.notifications = notifications;
        if (privacy !== undefined) user.settings.privacy = privacy;
        if (theme !== undefined) user.settings.theme = theme;

        await user.save();

        res.json({
            message: 'Settings updated successfully',
            settings: user.settings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optional: Verify password before deletion
        const { password } = req.body;

        if (user.password && password) {
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Password is incorrect' });
            }
        }

        // Remove user from friends lists of other users
        await User.updateMany(
            { friends: user._id },
            { $pull: { friends: user._id } }
        );

        // Remove friend requests from/to this user
        await User.updateMany(
            { 'friendRequests.from': user._id },
            { $pull: { friendRequests: { from: user._id } } }
        );

        await user.deleteOne();

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
