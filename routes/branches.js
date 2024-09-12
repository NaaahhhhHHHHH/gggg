const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();
const {
  createBranch,
  getAllBranches,
  updateBranch,
  deleteBranch
} = require('../controllers/branchesController');

router.post('/api/branches', authenticateToken, createBranch); 
router.get('/api/branches', getAllBranches);
router.put('/api/branches/:id', authenticateToken, updateBranch); 
router.delete('/api/branches/:id', authenticateToken, deleteBranch); 

module.exports = router;
