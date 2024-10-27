const Expense = require("../models/Expense");
const mongoose = require('mongoose');

// Add individual expense
exports.addIndividualExpense = async (req, res) => {
    const { amount, memberId, message } = req.body;

    try {
        const expense = new Expense({
            adminId: req.user.id,
            amount,
            isPersonal: true,
            memberId,
            message
        });
        await expense.save();
        res.status(201).json({ message: `Personal expense of ${amount} added for member`, expense });
    } catch (error) {
        res.status(500).json({ message: 'Error adding individual expense', error });
    }
};

// Settle individual debt
exports.settleIndividualDebt = async (req, res) => {
    const { memberId, amount, message } = req.body;

    try {
        const settlement = new Expense({
            adminId: req.user.id,
            amount: -amount,
            isPersonal: true,
            memberId,
            message: message || `Member has paid off ${amount}`
        });
        await settlement.save();
        res.status(201).json({ message: `Settled ${amount} from member totals`, settlement });
    } catch (error) {
        res.status(500).json({ message: 'Error settling individual debt', error });
    }
};

// Add group expense and split among participants
exports.addGroupExpense = async (req, res) => {
    const { participants, amount, message } = req.body;

    try {
        const splitAmount = amount / participants.length;

        // Create individual expense records for each participant
        const expenses = participants.map(participant => ({
            adminId: req.user.id,
            memberId: participant,
            amount: splitAmount,
            isPersonal: false,
            message: message || `Group expense of ${amount} split among ${participants.length} members`
        }));

        await Expense.insertMany(expenses); // Bulk insert
        res.status(201).json({ message: `Group expense of ${amount} split among ${participants.length} participants`, expenses });
    } catch (error) {
        res.status(500).json({ message: 'Error adding group expense', error });
    }
};

// Get individual member balance including individual and group expenses
exports.getMemberBalance = async (req, res) => {
    const { memberId } = req.params;

    try {
        const personalExpenses = await Expense.aggregate([
            { $match: { memberId: new mongoose.Types.ObjectId(memberId), isPersonal: true } },
            { $group: { _id: null, totalPersonal: { $sum: "$amount" } } }
        ]);

        const groupExpenses = await Expense.aggregate([
            { $match: { memberId: new mongoose.Types.ObjectId(memberId), isPersonal: false } },
            { $group: { _id: null, totalGroup: { $sum: "$amount" } } }
        ]);

        const totalPersonal = personalExpenses[0]?.totalPersonal || 0;
        const totalGroup = groupExpenses[0]?.totalGroup || 0;
        const totalBalance = totalPersonal + totalGroup;

        res.json({ balance: totalBalance });
    } catch (error) {
        console.error('Error calculating balance:', error);
        res.status(500).json({ message: 'Error calculating balance', error: error.message });
    }
};

// Get complete expense history for a specific member
exports.getMemberExpenseHistory = async (req, res) => {
    const { memberId } = req.params;

    try {
        const history = await Expense.find({
            $or: [
                { memberId: memberId, isPersonal: true }, // Individual expenses
                { memberId: memberId, isPersonal: false } // Group expenses the member participated in
            ]
        })
            .sort({ createdAt: -1 }) // Sort by latest date
            .populate('memberId', 'username') // Populate member details
            .populate('adminId', 'username'); // Populate admin details

        res.json(history);
    } catch (error) {
        console.error('Error fetching member expense history:', error);
        res.status(500).json({ message: 'Error fetching expense history', error });
    }
};

// Get all expenses for the admin (general history)
exports.getExpenseHistory = async (req, res) => {
    try {
        const history = await Expense.find({ adminId: req.user.id })
            .populate('memberId', 'username') // Fetch member details if personal
            .populate('participants', 'username') // Fetch participants if group
            .sort({ createdAt: -1 }); // Sort by latest

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense history', error });
    }
};
