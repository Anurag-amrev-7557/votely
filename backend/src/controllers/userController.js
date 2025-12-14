const User = require('../models/User');

// @desc    Create new user (Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Default password if not provided? Or require it.
        // For admin creation, maybe generate one or require it. 
        // Creating user usually triggers pre-save hash.

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const user = await User.create({
            name,
            email,
            password, // Will be hashed by pre-save
            role: role || 'user',
            isActive: status === 'active' // Map status string to boolean
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.isActive ? 'active' : 'inactive'
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error creating user' });
    }
};

// @desc    Get all users with filtering and pagination
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role, status, sort = 'createdAt', order = 'desc' } = req.query;

        // Build query
        const query = {};

        // Search by name or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by role
        if (role && role !== 'all') {
            query.role = role;
        }

        // Filter by status (active/inactive based on isVerified/isActive properties if they exist mainly, or add status field context)
        // Looking at User model, we have `isVerified` and `isActive`. 
        // Let's assume 'status' maps loosely or we check both. 
        // Or we can add a computed status in aggregation if needed, but for now filtering by database fields
        if (status && status !== 'all') {
            if (status === 'active') {
                query.isActive = true;
            } else if (status === 'inactive') {
                query.isActive = false;
            } else if (status === 'suspended') {
                // If we have a suspended flag, otherwise ignore or map to !isActive
                // User model didn't explicitly show 'suspended' enum, assuming regular isActive bool
                query.isActive = false;
            }
        }

        // Sort options
        const sortOptions = {};
        if (sort) {
            sortOptions[sort] = order === 'asc' ? 1 : -1;
        }

        const count = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password') // Exclude password
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Map users to include a 'status' string if the frontend expects 'active'/'inactive' based on boolean
        const formattedUsers = users.map(user => ({
            ...user,
            id: user._id, // Ensure id is available as 'id' for frontend convenience
            status: user.isActive ? 'active' : (user.isVerified ? 'inactive' : 'pending') // Example logic
        }));

        res.json({
            users: formattedUsers,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalUsers: count
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server error fetching users' });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Server error fetching user' });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const { name, email, role, status, permissions } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        // Handle status mapping back to boolean
        if (status) {
            if (status === 'active') user.isActive = true;
            else if (status === 'inactive' || status === 'suspended') user.isActive = false;
        }

        // Update permissions if your User model supports it
        // user.permissions = permissions || user.permissions;

        const updatedUser = await user.save();

        res.json({
            ...updatedUser.toObject(),
            status: updatedUser.isActive ? 'active' : 'inactive'
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error updating user' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.deleteOne(); // Use deleteOne() or remove() depending on Mongoose version
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server error deleting user' });
    }
};

// @desc    Bulk update users
// @route   POST /api/users/bulk-update
// @access  Private/Admin
const bulkUpdateUsers = async (req, res) => {
    try {
        const { userIds, action, value } = req.body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ error: 'No users selected' });
        }

        const updateData = {};

        // Determine what to update
        if (action === 'setActive') {
            updateData.isActive = value === true; // Ensure boolean
        } else if (action === 'setRole') {
            const validRoles = ['user', 'admin', 'moderator', 'election_committee']; // Add your valid roles
            if (validRoles.includes(value)) {
                updateData.role = value;
            } else {
                return res.status(400).json({ error: 'Invalid role' });
            }
        } else if (action === 'delete') {
            // Special case for delete
            await User.deleteMany({ _id: { $in: userIds } });
            return res.json({ message: `Successfully deleted ${userIds.length} users` });
        }

        if (Object.keys(updateData).length > 0) {
            const result = await User.updateMany(
                { _id: { $in: userIds } },
                { $set: updateData }
            );
            return res.json({ message: `Successfully updated ${result.modifiedCount} users`, count: result.modifiedCount });
        }

        res.status(400).json({ error: 'Invalid action' });

    } catch (error) {
        console.error('Error bulk updating users:', error);
        res.status(500).json({ error: 'Server error during bulk update' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    bulkUpdateUsers
};
