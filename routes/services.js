const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  createService,
  getAllServices,
  updateService,
  deleteService
} = require('../controllers/servicesController');

router.post('/api/services', authenticateToken, createService);
router.get('/api/services', getAllServices);
router.put('/api/services/:id', authenticateToken, updateService);
router.delete('/api/services/:id', authenticateToken, deleteService);

module.exports = router;
