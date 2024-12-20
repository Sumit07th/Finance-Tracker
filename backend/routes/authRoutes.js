const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {authenticateToken} = require("../middleware/authMiddleware");

router.post('/login', authController.login);

router.post('/register', authController.register);

router.post('/logout',authenticateToken, authController.logout);

router.post('/changed-password',authenticateToken,authController.changePassword)

router.post('/addIncome',authenticateToken, authController.addIncome);

router.put('/updateIncome',authenticateToken, authController.updateIncome);

router.get('/getIncome',authenticateToken, authController.getIncome);


module.exports = router;