const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  createCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customersController');

router.post('/api/customers', authenticateToken, createCustomer);
router.get('/api/customers', authenticateToken, getAllCustomers);
router.put('/api/customers/:id', authenticateToken, updateCustomer);
router.delete('/api/customers/:id', authenticateToken, deleteCustomer);

module.exports = router;
