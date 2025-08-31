const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  msisdn: {
    type: String,
    required: true,
    index: true // For faster lookups by msisdn
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['charge', 'refund'],
    default: 'charge'
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'success'
  },
  metadata: {
    // Additional transaction details if needed
    type: Map,
    of: Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Index for faster querying by date ranges
transactionSchema.index({ timestamp: -1 });

// Compound index for querying transactions by user and date
transactionSchema.index({ msisdn: 1, timestamp: -1 });

// Static method to create a new transaction
transactionSchema.statics.createTransaction = async function(msisdn, serviceId, amount, type = 'charge') {
  return await this.create({
    msisdn,
    serviceId,
    amount,
    type
  });
};

// Static method to get user transactions with optional filters
transactionSchema.statics.getUserTransactions = async function(msisdn, filters = {}) {
  const query = { msisdn, ...filters };
  return await this.find(query)
    .sort({ timestamp: -1 })
    .populate('serviceId', 'name description price'); // Populate service details
};

// Static method to get transaction statistics
transactionSchema.statics.getTransactionStats = async function(msisdn) {
  return await this.aggregate([
    { $match: { msisdn } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
