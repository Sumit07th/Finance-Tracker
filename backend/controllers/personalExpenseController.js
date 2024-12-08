const User = require("../models/User");
const PersonalExpense = require("../models/PersonalExpense");

exports.addPersonalExpense = async (req, res) => {
    try {
        const { amount, message, category, paymentMethod, isRecurring, recurrencePeriod, tags, notes } = req.body;
        const userId = req.user._id;

        if (!amount || !message || !category) {
            return res.status(400).json({ message: 'Amount, message, and category are required' });
        }

        if (isRecurring && !recurrencePeriod) {
            return res.status(400).json({ message: 'Recurrence period is required for recurring expenses' });
        }

        const newExpense = new PersonalExpense({
            userId,
            amount,
            message,
            category,
            paymentMethod,
            isRecurring,
            recurrencePeriod,
            tags,
            notes
        });

        await newExpense.save();
        res.status(201).json({ message: 'Personal expense added successfully', expense: newExpense });
    } catch (error) {
        console.error('Error adding personal expense:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPersonalExpenseHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { category, startDate, endDate, tags } = req.query;

        const query = { userId };

        if (category) {
            query.category = category;
        }
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (tags) {
            query.tags = { $in: tags.split(',') }; // Allow multiple tags as a comma-separated list
        }

        const expenses = await PersonalExpense.find(query).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Expenses retrieved successfully', expenses });
    } catch (error) {
        console.error('Error fetching personal expense history:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getTotalPersonalExpense = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalSpent = await PersonalExpense.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.status(200).json({ message: 'Total expense calculated successfully', total: totalSpent[0]?.total || 0 });
    } catch (error) {
        console.error('Error calculating total personal expense:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updatePersonalExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { amount, message, category, paymentMethod, tags, notes } = req.body;

        const updatedExpense = await PersonalExpense.findOneAndUpdate(
            { _id: expenseId, userId: req.user.id },
            { amount, message, category, paymentMethod, tags, notes, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense updated successfully', expense: updatedExpense });
    } catch (error) {
        console.error('Error updating personal expense:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deletePersonalExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;

        const deletedExpense = await PersonalExpense.findOneAndDelete({
            _id: expenseId,
            userId: req.user.id
        });

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting personal expense:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getExpensesByCategory = async (req, res) => {
    try {
        const userId = req.user.id;

        const expensesByCategory = await PersonalExpense.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]);

        res.status(200).json({ message: 'Expenses by category retrieved successfully', data: expensesByCategory });
    } catch (error) {
        console.error('Error fetching expenses by category:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getMonthlyExpenseSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const monthlySummary = await PersonalExpense.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } } // Sort by month
        ]);

        res.status(200).json({ message: 'Monthly expense summary retrieved successfully', data: monthlySummary });
    } catch (error) {
        console.error('Error fetching monthly expense summary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

