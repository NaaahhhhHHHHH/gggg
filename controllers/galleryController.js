const Gallery = require('../models/Gallery');

// Create a new gallery item
exports.createGalleryItem = async (req, res) => {
  // #swagger.tags = ['gallery']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'gallery data.',
            required: true,
            schema: {
                title: "",
                subtitle: "",
                text: "",
                url: ""
            }
        }
  */
  try {
    const galleryItem = await Gallery.create(req.body);
    res.status(201).json(galleryItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all gallery items
exports.getAllGalleryItems = async (req, res) => {
  // #swagger.tags = ['gallery']
  try {
    const galleryItems = await Gallery.findAll();
    res.status(200).json(galleryItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a gallery item
exports.updateGalleryItem = async (req, res) => {
  // #swagger.tags = ['gallery']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'gallery data.',
            required: true,
            schema: {
                title: "",
                subtitle: "",
                text: "",
                url: ""
            }
        }
  */
  try {
    const galleryItem = await Gallery.findByPk(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    await galleryItem.update(req.body);
    res.status(200).json(galleryItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a gallery item
exports.deleteGalleryItem = async (req, res) => {
  // #swagger.tags = ['gallery']
  try {
    const galleryItem = await Gallery.findByPk(req.params.id); 
    if (!galleryItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    await galleryItem.destroy();
    res.status(200).json({ message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
