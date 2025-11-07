import Task from "../models/Task.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const getUsers = async (req, res) => {
    try {
        const users = await User.find({role: "admin"}).select('-password');

        // For each user, get the count of tasks assigned
        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Pending' });
                const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: 'In Progress' });
                const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Completed' });
                
                return {
                    ...user._doc,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks
                };
            }
        ));

        res.status(200).json(usersWithTaskCounts);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.remove();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { getUsers, getUserById, deleteUser };