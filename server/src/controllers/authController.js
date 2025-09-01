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
