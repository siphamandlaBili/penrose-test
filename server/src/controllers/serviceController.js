
const { Service } = require('../models/service');
const { log, error } = require('../utils/logger');

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
  getServiceById
};
