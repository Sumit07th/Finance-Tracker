// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // New field
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
