const User = require('../models/user');

// Get user profile by msisdn (from req.user)
const getProfile = async (req, res) => {
  try {
    const { msisdn } = req.user;
    const user = await User.findOne({ msisdn });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const profile = {
      msisdn: user.msisdn,
      memberSince: user.createdAt,
      provider: user.provider,
      airtime: user.airtime,
      isAdmin: user.isAdmin || false
    };
    console.log('API /user/profile response:', profile);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

module.exports = { getProfile };
