const express = require('express');
const router = express.Router();
const { getAdminProfile, getActiveUsersPerService } = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

router.get('/profile', authMiddleware, getAdminProfile);
router.get('/active-users-per-service', authMiddleware, getActiveUsersPerService);

module.exports = router;
