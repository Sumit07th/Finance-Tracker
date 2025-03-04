const User = require('../models/User');
const { hashedPassword, comparePassword } = require('../utils/hashUtils');
const { generateToken } = require("../utils/jwtUtils");

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedpass = await hashedPassword(password);
        const newUser = new User({ username, email, password: hashedpass });
        await newUser.save();

        const token = generateToken(newUser._id);
        return res.json({
            token,
            user: { email: newUser.email } // Return the user info
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: 'Error registering user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        return res.json({
            token,
            user: { _id:user._id,email: user.email,username:user.username } // Ensure you are returning user information
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: 'Error logging in' });
    }
};

exports.logout = (req, res) => {
    return res.status(200).json({ message: 'Logout successful' });
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    console.log({oldPassword,newPassword});
    const userId = req.user._id;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({message:'Old password and new password are required'})
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
        return res.status(400).json({message:'Invalid user id or user does not exist'});
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await comparePassword(oldPassword, user.password);

    if (!isMatch) {
        return res.status(400).json({message:'Invalid Old Password'});
    }
    const hashedPass = await hashedPassword(newPassword);
    user.password = hashedPass;
    await user.save();

    user.password = undefined;

   return res.status(200).json({
        success: true,
        message: 'Password changed successfully',
    });
};

// Add income to the user
exports.addIncome = async (req, res) => {
    try {
        const { income } = req.body;
        const userId = req.user._id;

        if (!income) {
            return res.status(400).json({ message: 'Income is required' });
        }

        // Update the user's income
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.income = income;
        await user.save();

        res.status(200).json({ message: 'Income added successfully', income: user.income });
    } catch (error) {
        console.error('Error adding income:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Update income for the user
exports.updateIncome = async (req, res) => {
    try {
        const { income } = req.body;
        const userId = req.user._id;

        if (!income) {
            return res.status(400).json({ message: 'Income is required' });
        }

        // Find and update the user's income
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.income = income;
        await user.save();

        res.status(200).json({ message: 'Income updated successfully', income: user.income });
    } catch (error) {
        console.error('Error updating income:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get income for the user
exports.getIncome = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ income: user.income });
    } catch (error) {
        console.error('Error fetching income:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

