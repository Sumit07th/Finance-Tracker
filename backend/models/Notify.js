const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        message: { type: String, required: true },
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        isRead: { type: Boolean, default: false },
        status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
