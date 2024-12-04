const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    isPersonal: {type: Boolean, default:false},
    memberId: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    message: {type:String},
    createdAt: { type: Date, default: Date.now },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    groupId: {type:mongoose.Schema.Types.ObjectId,ref:'Group'},
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
