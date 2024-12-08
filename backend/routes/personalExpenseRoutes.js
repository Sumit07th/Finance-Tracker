const express = require('express');
const {
    addPersonalExpense,
    getPersonalExpenseHistory,
    getTotalPersonalExpense,
    updatePersonalExpense,
    deletePersonalExpense,
    getExpensesByCategory,
    getMonthlyExpenseSummary
} = require('../controllers/personalExpenseController');
const { authenticateToken }  = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addExpense', authenticateToken, addPersonalExpense);
router.get('/history', authenticateToken, getPersonalExpenseHistory);
router.get('/total', authenticateToken, getTotalPersonalExpense);
router.put('/update/:expenseId', authenticateToken, updatePersonalExpense);
router.delete('/delete/:expenseId', authenticateToken, deletePersonalExpense);
router.get('/category-summary', authenticateToken, getExpensesByCategory);
router.get('/monthly-summary', authenticateToken, getMonthlyExpenseSummary);

module.exports = router;
