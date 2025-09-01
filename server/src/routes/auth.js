const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, logout, register } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// ✅ fix: express-rate-limit v8 requires .default in CommonJS
const rateLimit = require('express-rate-limit').default;

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many OTP requests from this IP, please try again later.'
});

// Routes
router.post('/send-otp', otpLimiter, sendOTP);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/logout', authMiddleware, logout);

module.exports = router;
