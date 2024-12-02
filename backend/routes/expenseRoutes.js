const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    addIndividualExpense,
    settleIndividualDebt,
    addGroupExpense,
    getMemberBalance,
    getExpenseHistory,
    getMemberExpenseHistory,
    getMemberGroupExpenseHistory,
    getGroupExpenseHistory// Assuming this is implemented in your controller
} = require('../controllers/expenseController');

// Accessible by admin only
router.post('/add-individual', authenticateToken, addIndividualExpense);
router.post('/settle', authenticateToken, settleIndividualDebt);
router.post('/group', authenticateToken, addGroupExpense);

// Accessible by both admin and member
router.get('/balance/:memberId', authenticateToken, getMemberBalance);
router.get('/history/member/:memberId', authenticateToken, getMemberExpenseHistory);
router.get('/history', authenticateToken, getExpenseHistory);
router.get("/history/member/:groupId/:memberId",authenticateToken, getMemberGroupExpenseHistory); // Member's history in a group
router.get("/history/group/:groupId",authenticateToken, getGroupExpenseHistory);

module.exports = router;
