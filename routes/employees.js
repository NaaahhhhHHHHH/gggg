const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeesController');

router.post('/api/employees', authenticateToken, createEmployee);
router.get('/api/employees', getAllEmployees);
router.put('/api/employees/:id', authenticateToken, updateEmployee);
router.delete('/api/employees/:id', authenticateToken , deleteEmployee);

module.exports = router;
