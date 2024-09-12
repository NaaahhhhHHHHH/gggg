const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();
const { register, loginCustomer, loginAdmin, updateUser, updatePassword, getAllUsers, deleteUser } = require('../controllers/authController');

router.post('/api/auth/register', register); 
router.post('/api/auth/loginCustomer', loginCustomer);
router.post('/api/auth/loginAdmin', loginAdmin);
router.put('/api/auth/updateUser/:id', authenticateToken, updateUser);
router.put('/api/auth/updatePassword/:id', authenticateToken, updatePassword);
router.delete('/api/auth/deleteUser/:id', authenticateToken, deleteUser);
router.get('/api/auth', authenticateToken, getAllUsers);

module.exports = router;
