const express = require('express');
const router = express.Router();
const { getAllServices, getServiceById, createService } = require('../controllers/serviceController');
const authMiddleware = require('../middleware/auth');


// Admin: Create a new service
router.post('/', authMiddleware, createService);

router.get('/', authMiddleware, getAllServices);
router.get('/:id', authMiddleware, getServiceById);

module.exports = router;
