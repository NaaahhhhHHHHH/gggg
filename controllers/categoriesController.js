const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  // #swagger.tags = ['categories']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Category data.',
            required: true,
            schema: {
                title: "Sample Title",
                subtitle: "Sample Subtitle",
                text: "Sample text",
                url: "http://example.com"
            }
        }
  */
  try {
    const { title, subtitle, text, url } = req.body;
    const newCategory = await Category.create({ title, subtitle, text, url });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  // #swagger.tags = ['categories']
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  // #swagger.tags = ['categories']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Category data.',
            required: true,
            schema: {
                title: "Updated Title",
                subtitle: "Updated Subtitle",
                text: "Updated text",
                url: "http://updated-example.com"
            }
        }
  */
  try {
    const { title, subtitle, text, url } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.update({ title, subtitle, text, url });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  // #swagger.tags = ['categories']
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
