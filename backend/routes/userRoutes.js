const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { getAllUsers, addUser, deleteUser } = require('../controllers/userController');

router.get('/get', authenticateToken, authorizeRole(['admin', 'member']), getAllUsers);
router.post('/add', authenticateToken, authorizeRole(['admin']), addUser);
router.delete('/delete/:id', authenticateToken, authorizeRole(['admin']), deleteUser);

module.exports = router;
