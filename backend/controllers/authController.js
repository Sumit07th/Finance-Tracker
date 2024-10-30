const User = require('../models/User');
const { hashedPassword, comparePassword } = require('../utils/hashUtils');
const { generateToken } = require("../utils/jwtUtils");

exports.register = async (req, res) => {
    try {
        const { username, email, password,role } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedpass = await hashedPassword(password);
        const newUser = new User({ username, email, password: hashedpass,role: role });
        await newUser.save();

        const token = generateToken(newUser._id);
        return res.json({
            token,
            user: { email: newUser.email, role: newUser.role } // Return the user info
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
            user: { email: user.email, role: user.role } // Ensure you are returning user information
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: 'Error logging in' });
    }
};

exports.logout = (req, res) => {
    return res.status(200).json({ message: 'Logout successful' });
};
