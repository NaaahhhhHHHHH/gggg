const Blog = require('../models/Blog');

// Create a new blog
exports.createBlog = async (req, res) => {
  // #swagger.tags = ['blogs']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'blogs data.',
            required: true,
            schema: {
                title: "",
                content: "",
                author: "",
                date: "",
                image: "",
            }
        }
  */
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  // #swagger.tags = ['blogs']
  try {
    const blogs = await Blog.findAll();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  // #swagger.tags = ['blogs']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'blogs data.',
            required: true,
            schema: {
                title: "",
                content: "",
                author: "",
                date: "",
                image: "",
            }
        }
  */
  try {
    const [updatedRows] = await Blog.update(req.body, {
      where: { id: req.params.id },
      returning: true, // Ensures returning the updated row
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const updatedBlog = await Blog.findByPk(req.params.id);
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  // #swagger.tags = ['blogs']
  try {
    const deletedRows = await Blog.destroy({
      where: { id: req.params.id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
