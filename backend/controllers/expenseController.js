const Expense = require("../models/Expense");
const mongoose = require('mongoose');
const Group = require("../models/Group");

// Add individual expense
exports.addIndividualExpense = async (req, res) => {
    const { groupId,amount, memberId, message } = req.body;

    try {
        const expense = new Expense({
            groupId,
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
    const { groupId,memberId, amount, message } = req.body;

    try {
        const settlement = new Expense({
            groupId,
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
    const { groupId, amount, message } = req.body;


    try {
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const participants = group.members;
        const splitAmount = amount / participants.length;

        // Create individual expense records for each participant
        const expenses = participants.map(participant => ({
            groupId,
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
// Get Member Balance in a Group

exports.getMemberBalance = async (req, res) => {
    const { groupId, memberId } = req.params;
    console.log(`Received request with groupId: ${groupId}, memberId: ${memberId}`);

    try {
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            console.error(`Invalid groupId: ${groupId}`);
            return res.status(400).json({ message: "Invalid groupId format" });
        }
        if (!mongoose.Types.ObjectId.isValid(memberId)) {
            console.error(`Invalid memberId: ${memberId}`);
            return res.status(400).json({ message: "Invalid memberId format" });
        }

        // Use new ObjectId() for instantiating ObjectId
        const personalExpenses = await Expense.aggregate([
            { $match: { groupId: new mongoose.Types.ObjectId(groupId), memberId: new mongoose.Types.ObjectId(memberId), isPersonal: true } },
            { $group: { _id: null, totalPersonal: { $sum: "$amount" } } },
        ]);

        const groupExpenses = await Expense.aggregate([
            { $match: { groupId: new mongoose.Types.ObjectId(groupId), memberId: new mongoose.Types.ObjectId(memberId), isPersonal: false } },
            { $group: { _id: null, totalGroup: { $sum: "$amount" } } },
        ]);

        const totalPersonal = personalExpenses.length ? personalExpenses[0].totalPersonal : 0;
        const totalGroup = groupExpenses.length ? groupExpenses[0].totalGroup : 0;
        const totalBalance = totalPersonal + totalGroup;

        res.json({ balance: totalBalance });
    } catch (error) {
        console.error("Error in getMemberBalance:", error);
        res.status(500).json({ message: "Error calculating balance", error });
    }
};


// get a history of a specific member for one specific groups

exports.getMemberGroupExpenseHistory = async (req, res) => {
    const{groupId,memberId} = req.params;
    try{
        const expenses = await Expense.find({
            groupId:groupId,
            memberId:memberId
        })
            .sort({createdAt: -1})
            .populate('memberId','username')
            .populate('adminId','username')

        if (!expenses || expenses.length === 0) {
            return res.status(200).json([]);
        }

        // Format the expense history
        const history = expenses.map(expense => ({
            amount: expense.amount,
            message: expense.message,
            isPersonal: expense.isPersonal,
            member: expense.memberId ? expense.memberId.username : 'Group',
            admin: expense.adminId?.username || 'N/A',
            createdAt: expense.createdAt
        }));

        return res.status(200).json({ success: true, history });
    } catch(error){
        console.error('Error fetching member group expense history:', error);
        return res.status(500).json({ message: 'Error fetching member group expense history', error });
    }
}

// history of expenses of a particular group



exports.getGroupExpenseHistory = async (req, res) => {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID' });
    }

    try {

        const expenses = await Expense.find({ groupId })
            .sort({ createdAt: -1 }) // Sort by latest first
            .populate('memberId', 'username') // Populate memberId with username
            .populate('adminId', 'username'); // Populate adminId with username

        // Check if expenses exist
        if (!expenses || expenses.length === 0) {
            return res.status(200).json([]);
        }

        // Format the expense history
        const history = expenses.map(expense => ({
            amount: expense.amount,
            message: expense.message,
            isPersonal: expense.isPersonal,
            member: expense.memberId ? expense.memberId.username : 'Group',
            admin: expense.adminId?.username || 'N/A',
            createdAt: expense.createdAt
        }));

        console.log(history);


        return res.status(200).json({ success: true, history });
    } catch (error) {
        console.error('Error fetching group expense history:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};




