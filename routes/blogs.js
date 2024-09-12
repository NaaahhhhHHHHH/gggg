const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog
} = require('../controllers/blogsController');

router.post('/api/blogs', authenticateToken, createBlog);
router.get('/api/blogs', getAllBlogs);
router.put('/api/blogs/:id', authenticateToken, updateBlog);
router.delete('/api/blogs/:id', authenticateToken, deleteBlog);

module.exports = router;
