const Subscription = require('../models/subscription');
const User = require('../models/user');
const Service = require('../models/service').Service;

// Get total active users per service (admin only)
const getActiveUsersPerService = async (req, res) => {
  console.log('ADMIN STATS: req.user:', req.user);
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    // Aggregate active subscriptions grouped by serviceId
    const agg = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$serviceId', activeUsers: { $addToSet: '$msisdn' } } },
      { $project: { serviceId: '$_id', activeUserCount: { $size: '$activeUsers' } } }
    ]);
    console.log('ADMIN STATS: aggregation result:', agg);
    // Populate service details
    const results = await Promise.all(
      agg.map(async (row) => {
        const service = await Service.findById(row.serviceId);
        return {
          serviceId: row.serviceId,
          serviceName: service?.name || 'Unknown',
          activeUserCount: row.activeUserCount
        };
      })
    );
    console.log('ADMIN STATS: final results:', results);
    res.json(results);
  } catch (err) {
    console.error('ADMIN STATS: error:', err);
    res.status(500).json({ message: 'Error fetching admin stats', error: err.message });
  }
};

module.exports = { getActiveUsersPerService };
