const Role = require('../models/Role');
const User = require('../models/User');

// Create
exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get All
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get By Id
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json(role);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update
exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Soft Delete
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json({ message: 'Role soft deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all users by Role ID
exports.getUsersByRole = async (req, res) => {
    try {
        const users = await User.find({ role: req.params.id, isDeleted: false }).populate('role');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
