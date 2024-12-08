const mongoose = require('mongoose');

const personalExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be a positive number']
    },
    message: {
        type: String,
        required: true,
        maxlength: [255, 'Message cannot exceed 255 characters']
    },
    category: {
        type: String,
        enum: ['Tour', 'Party', 'House Rent', 'Electricity', 'Groceries', 'Food', 'Health', 'Transportation', 'Education', 'Other'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Other'],
        default: 'Cash'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrencePeriod: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        required: function () {
            return this.isRecurring;
        }
    },
    tags: {
        type: [String],
        default: []
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

personalExpenseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('PersonalExpense', personalExpenseSchema);
