const Transaction = require('../models/transaction');
const { error } = require('../utils/logger');

/**
 * Get all transactions for a user with optional filters
 */
const getUserTransactions = async (req, res) => {
  try {
    const { msisdn } = req.user;
    const { type, status, startDate, endDate } = req.query;

    // Build filter object
    const filters = {};
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.$gte = new Date(startDate);
      if (endDate) filters.timestamp.$lte = new Date(endDate);
    }

    const transactions = await Transaction.getUserTransactions(msisdn, filters);
    res.json(transactions);
  } catch (error) {
  error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

/**
 * Create a new transaction
 */
const createTransaction = async (req, res) => {
  try {
    const { msisdn } = req.user;
    const { serviceId, amount, type = 'charge' } = req.body;

    const transaction = await Transaction.createTransaction(msisdn, serviceId, amount, type);
    res.status(201).json(transaction);
  } catch (error) {
  error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};

/**
 * Get transaction statistics for a user
 */
const getTransactionStats = async (req, res) => {
  try {
    const { msisdn } = req.user;
    const stats = await Transaction.getTransactionStats(msisdn);
    res.json(stats);
  } catch (error) {
  error('Error fetching transaction stats:', error);
    res.status(500).json({ message: 'Error fetching transaction statistics', error: error.message });
  }
};

module.exports = {
  getUserTransactions,
  createTransaction,
  getTransactionStats
};
