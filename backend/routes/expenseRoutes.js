const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const {
    addIndividualExpense,
    settleIndividualDebt,
    addGroupExpense,
    getMemberBalance,
    getExpenseHistory,
    getMemberExpenseHistory // Assuming this is implemented in your controller
} = require('../controllers/expenseController');

// Accessible by admin only
router.post('/add-individual', authenticateToken, authorizeRole(['admin']), addIndividualExpense);
router.post('/settle', authenticateToken, authorizeRole(['admin']), settleIndividualDebt);
router.post('/group', authenticateToken, authorizeRole(['admin']), addGroupExpense);

// Accessible by both admin and member
router.get('/balance/:memberId', authenticateToken, authorizeRole(['admin', 'member']), getMemberBalance);
router.get('/history/member/:memberId', authenticateToken, authorizeRole(['admin', 'member']), getMemberExpenseHistory);
router.get('/history', authenticateToken, authorizeRole(['admin', 'member']), getExpenseHistory);

module.exports = router;
