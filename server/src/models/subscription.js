const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  msisdn: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  lastBillingDate: {
    type: Date,
    default: Date.now
  },
  nextBillingDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Methods
subscriptionSchema.statics.addSubscription = async function(msisdn, serviceId) {
  const service = await mongoose.model('Service').findById(serviceId);
  if (!service) throw new Error('Service not found');

  let nextBillingDate = new Date();
  switch (service.billingCycle) {
    case 'daily':
      nextBillingDate.setDate(nextBillingDate.getDate() + 1);
      break;
    case 'weekly':
      nextBillingDate.setDate(nextBillingDate.getDate() + 7);
      break;
    case 'monthly':
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      break;
  }

  return this.create({
    msisdn,
    serviceId,
    nextBillingDate
  });
};

subscriptionSchema.statics.getUserSubscriptions = async function(msisdn) {
  const subs = await this.find({ msisdn }).populate('serviceId');
  // Map serviceId to service for frontend compatibility
  return subs.map(sub => {
    const obj = sub.toObject();
    obj.service = obj.serviceId;
    return obj;
  });
};

// Indexes
subscriptionSchema.index({ msisdn: 1, status: 1 });
subscriptionSchema.index({ nextBillingDate: 1 }, { expireAfterSeconds: 0 });

// Instance method to cancel subscription
subscriptionSchema.methods.cancel = async function() {
  this.status = 'cancelled';
  this.endDate = new Date();
  return await this.save();
};

// Static method to cancel a subscription
subscriptionSchema.statics.cancelSubscription = async function(msisdn, subscriptionId) {
  const subscription = await this.findOne({
    _id: subscriptionId,
    msisdn
  });

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  return await subscription.cancel();
};

// Static method to check if user is subscribed to a service
subscriptionSchema.statics.isSubscribed = async function(msisdn, serviceId) {
  const count = await this.countDocuments({
    msisdn,
    serviceId,
    status: 'active'
  });
  return count > 0;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
