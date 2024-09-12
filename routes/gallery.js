const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  createGalleryItem,
  getAllGalleryItems,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');

router.post('/api/gallery', authenticateToken, createGalleryItem);
router.get('/api/gallery', getAllGalleryItems);
router.put('/api/gallery/:id', authenticateToken, updateGalleryItem);
router.delete('/api/gallery/:id', authenticateToken, deleteGalleryItem);

module.exports = router;
