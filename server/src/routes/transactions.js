const express = require('express');
const router = express.Router();
const { getUserTransactions } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getUserTransactions);

module.exports = router;
