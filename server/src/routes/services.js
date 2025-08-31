const express = require('express');
const router = express.Router();
const { getAllServices, getServiceById } = require('../controllers/serviceController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getAllServices);
router.get('/:id', authMiddleware, getServiceById);

module.exports = router;
