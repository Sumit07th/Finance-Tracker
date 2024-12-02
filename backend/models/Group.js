const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Members ka User ID
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin of the groupq+
}, { timestamps: true });

module.exports = mongoose.model('Group', GroupSchema);