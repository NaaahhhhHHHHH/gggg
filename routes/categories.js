const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoriesController');

router.post('/api/categories', authenticateToken, createCategory);
router.get('/api/categories', getAllCategories);
router.put('/api/categories/:id', authenticateToken, updateCategory);
router.delete('/api/categories/:id', authenticateToken, deleteCategory);

module.exports = router;
