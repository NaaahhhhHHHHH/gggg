const express = require('express');
const {authenticateToken, authorizeRole} = require('../middleware/authMiddleware');
const router = express.Router();
const {login} = require('../controllers/authController');

router.post('/api/auth', login);

module.exports = router;
