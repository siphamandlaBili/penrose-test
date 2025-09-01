const jwt = require('jsonwebtoken');
const { log, error } = require('../utils/logger');
const User = require('../models/user');

const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP only if user exists
const sendOTP = async (req, res) => {
  try {
    const { msisdn } = req.body;

    if (!msisdn || !/^\d{10}$/.test(msisdn)) {
      return res.status(400).json({ message: 'Invalid mobile number' });
    }

    // Check if user exists
    const user = await User.findOne({ msisdn });
    if (!user) {
      return res.status(404).json({ message: 'Number not registered. Please register as a user.' });
    }

    const otp = generateOTP();
    otpStore.set(msisdn, {
      otp,
      expiry: Date.now() + parseInt(process.env.OTP_EXPIRY)
    });

    // Simulate OTP sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, integrate with SMS gateway
  log(`OTP for ${msisdn}: ${otp}`);

    // Only send OTP in response during development
    if (process.env.NODE_ENV === 'development') {
      res.json({ 
        message: 'OTP sent successfully',
        otp: otp // Only included in development
      });
    } else {
      res.json({ message: 'OTP sent successfully' });
    }
  } catch (error) {
  error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Register user and send OTP
const register = async (req, res) => {
  try {
  const { msisdn, name, provider } = req.body;
    if (!msisdn || !/^\d{10}$/.test(msisdn)) {
      return res.status(400).json({ message: 'Invalid mobile number' });
    }
    // Check if user already exists
    let user = await User.findOne({ msisdn });
    if (user) {
      return res.status(400).json({ message: 'User already registered. Please login.' });
    }
    user = new User({ msisdn, provider: provider || 'vodacom' });
    await user.save();

    // Send OTP after registration
    const otp = generateOTP();
    otpStore.set(msisdn, {
      otp,
      expiry: Date.now() + parseInt(process.env.OTP_EXPIRY)
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
  log(`OTP for ${msisdn}: ${otp}`);
    if (process.env.NODE_ENV === 'development') {
      res.json({ message: 'User registered and OTP sent', otp });
    } else {
      res.json({ message: 'User registered and OTP sent' });
    }
  } catch (error) {
  error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

const verifyOTP = async (req, res) => {
  const { msisdn, otp } = req.body;

  if (!msisdn || !otp) {
    return res.status(400).json({ message: 'MSISDN and OTP are required' });
  }

  res.clearCookie('token');

  const storedData = otpStore.get(msisdn);
  if (!storedData) {
    return res.status(400).json({ message: 'No OTP found for this number' });
  }

  if (Date.now() > storedData.expiry) {
    otpStore.delete(msisdn);
    return res.status(400).json({ message: 'OTP has expired' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  otpStore.delete(msisdn);

  const user = await User.findOne({ msisdn });

  const token = jwt.sign(
    { msisdn, isAdmin: user?.isAdmin || false },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // ✅ Cross-site cookie config
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, 
    sameSite: 'none', 
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: 'Authentication successful' });
};


const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  sendOTP,
  verifyOTP,
  logout,
  register
};
