const User = require('../models/User');

// Create
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get All
exports.getAllUsers = async (req, res) => {
    try {
        const query = { isDeleted: false };
        if (req.query.username) {
            query.username = { $regex: req.query.username, $options: 'i' };
        }
        const users = await User.find(query).populate('role');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get By Id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        ).populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Soft Delete
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User soft deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Enable User
exports.enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOne({ email, username, isDeleted: false });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or username' });
        }
        user.status = true;
        await user.save();
        res.status(200).json({ message: 'User status changed to true' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Disable User
exports.disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOne({ email, username, isDeleted: false });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or username' });
        }
        user.status = false;
        await user.save();
        res.status(200).json({ message: 'User status changed to false' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
