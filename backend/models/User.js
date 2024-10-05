const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: {type: String, required: true,unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true,unique: true},
    role: {type: String, enum: ['admin', 'member'],default: 'member'}
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);
