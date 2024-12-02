const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/config');

// Middleware to authenticate and authorize users with flexible role-based access
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not found.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found.', userExists: false });
        }
        req.user = user; // Attach user to the request
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};



module.exports = { authenticateToken };
