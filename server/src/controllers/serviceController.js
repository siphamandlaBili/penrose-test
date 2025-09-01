
const { Service } = require('../models/service');
const { log, error } = require('../utils/logger');

// Admin: Create a new service
const createService = async (req, res) => {
  try {
    // Only admin can create
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const { name, description, price, category, billingCycle } = req.body;
    if (!name || !description || !price || !category || !billingCycle) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newService = new Service({ name, description, price, category, billingCycle });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    error('Error creating service:', err);
    res.status(500).json({ message: 'Error creating service' });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true });
    res.json(services);
  } catch (error) {
    error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services' });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
  error('Error fetching service:', error);
    res.status(500).json({ message: 'Error fetching service' });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService
};
