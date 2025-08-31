const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, logout, register } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');


router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/logout', authMiddleware, logout);

module.exports = router;
