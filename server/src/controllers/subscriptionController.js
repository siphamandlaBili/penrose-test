const Subscription = require('../models/subscription');
const { error } = require('../utils/logger');
const Transaction = require('../models/transaction');
const { Service } = require('../models/service');
const TelcoBillingService = require('../services/telcoBilling');



const subscribe = async (req, res) => {
  try {
    const { serviceId } = req.body;
  const { msisdn } = req.user;
  const User = require('../models/user');
  const user = await User.findOne({ msisdn });
  const provider = user?.provider || 'vodacom';
  const telco = new TelcoBillingService(provider);

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if already subscribed
    const isSubscribed = await Subscription.isSubscribed(msisdn, serviceId);
    if (isSubscribed) {
      return res.status(400).json({ message: 'Already subscribed to this service' });
    }


    // Check user airtime
    if (user.airtime < service.price) {
      return res.status(400).json({ message: 'Insufficient airtime', provider });
    }

    // Attempt to charge the user (simulate telco)
    let billingResult;
    try {
      billingResult = await telco.chargeMsisdn(msisdn, service.price);
    } catch (error) {
      return res.status(400).json({ message: error.message, provider });
    }

    // Deduct airtime
    user.airtime -= service.price;
    await user.save();

    // Create subscription
    const subscription = await Subscription.addSubscription(msisdn, serviceId);

    // Record transaction
    await Transaction.createTransaction(msisdn, serviceId, service.price, 'charge');

    // Emit subscription event through Socket.IO
    req.app.get('io').emit(`subscription:${msisdn}`, {
      type: 'subscribe',
      subscription
    });
    // Emit admin stats update event
    req.app.get('io').emit('admin:statsUpdate');

    res.status(201).json({
      subscription,
      billing: {
        provider,
        reference: billingResult.reference,
        timestamp: billingResult.timestamp,
        amount: service.price
      }
    });
  } catch (error) {
  error('Error creating subscription:', error);
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { msisdn } = req.user;

    // Cancel subscription
    const subscription = await Subscription.cancelSubscription(msisdn, subscriptionId);

    // Refund transaction (record as refund)
    if (subscription && subscription.serviceId) {
      // Get service price
      const Service = require('../models/service');
      const service = await Service.findById(subscription.serviceId);
      if (service) {
        await Transaction.createTransaction(msisdn, service._id, service.price, 'refund');
      }
    }

    req.app.get('io').emit(`subscription:${msisdn}`, {
      type: 'unsubscribe',
      subscriptionId,
      subscription
    });
    // Emit admin stats update event
    req.app.get('io').emit('admin:statsUpdate');

    res.json({ 
      message: 'Subscription cancelled successfully',
      subscription 
    });
  } catch (error) {
    error('Error cancelling subscription:', error);
    res.status(500).json({ 
      message: 'Error cancelling subscription',
      error: error.message 
    });
  }
};

const getUserSubscriptions = async (req, res) => {
  try {
    const { msisdn } = req.user;
    const subscriptions = await Subscription.getUserSubscriptions(msisdn);
    res.json(subscriptions);
  } catch (error) {
  error('Error fetching subscriptions:', error);
    res.status(500).json({ 
      message: 'Error fetching subscriptions',
      error: error.message
    });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getUserSubscriptions
};
