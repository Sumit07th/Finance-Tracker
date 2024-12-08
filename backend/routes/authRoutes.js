const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {authenticateToken} = require("../middleware/authMiddleware");

router.post('/login', authController.login);

router.post('/register', authController.register);

router.post('/logout',authenticateToken, authController.logout);

router.post('/changed-password',authenticateToken,authController.changePassword)

module.exports = router;