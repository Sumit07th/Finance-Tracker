const express = require('express');
const { sendGroupInvitation, getUserNotifications, respondToInvitation,closeNotification } = require('../controllers/notifyController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

const router = express.Router();

router.post('/invite/:groupId', authenticateToken, sendGroupInvitation);
router.get('/notifications', authenticateToken, getUserNotifications);
router.post('/notifications/respond', authenticateToken, respondToInvitation);
router.post('/notifications/close-notifications',authenticateToken, closeNotification);

module.exports = router;
