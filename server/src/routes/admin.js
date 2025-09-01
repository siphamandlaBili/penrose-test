const express = require('express');
const router = express.Router();
const { getActiveUsersPerService } = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

router.get('/active-users-per-service', authMiddleware, getActiveUsersPerService);

module.exports = router;
