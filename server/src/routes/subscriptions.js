const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, getUserSubscriptions } = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', subscribe);
router.delete('/:subscriptionId', unsubscribe);
router.get('/', getUserSubscriptions);

module.exports = router;
