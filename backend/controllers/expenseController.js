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





// Get complete expense history for a specific member
exports.getMemberExpenseHistory = async (req, res) => {
    const  memberId  = req.params.memberId;

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

// get a history of a specific member for one specific groups

exports.getMemberGroupExpenseHistory = async (req, res) => {
    const{groupId,memberId} = req.params;
    try{
        const history = await Expense.find({
            groupId:groupId,
            memberId:memberId
        })
            .sort({createdAt: -1})
            .populate('memberId','username')
            .populate('adminId','username')

        res.json(history);
    } catch(error){
        console.error('Error fetching member group expense history:', error);
        res.status(500).json({ message: 'Error fetching member group expense history', error });
    }
}

// history of expenses of a particular group
exports.getGroupExpenseHistory = async (req, res) => {
    const { groupId } = req.params;

    try {
        const history = await Expense.find({ groupId: groupId }) // Filter by group ID
            .sort({ createdAt: -1 })
            .populate('memberId', 'username')
            .populate('adminId', 'username');

        res.json(history);
    } catch (error) {
        console.error('Error fetching group expense history:', error);
        res.status(500).json({ message: 'Error fetching group expense history', error });
    }
};