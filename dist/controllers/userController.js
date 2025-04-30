import User from "../models/userModel.js";
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};
export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, isActive } = req.body;
        const updateData = {};
        if (username)
            updateData.username = username;
        if (email)
            updateData.email = email;
        if (role)
            updateData.role = role;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        const updateduser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updateduser) {
            res.status(400).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updateduser);
    }
    catch (error) {
        console.log(error);
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.log(error);
    }
};
