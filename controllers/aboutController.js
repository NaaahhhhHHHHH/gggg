const About = require('../models/About');

// Create a new about
exports.createAbout = async (req, res) => {
  // #swagger.tags = ['about']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'about data.',
            required: true,
            schema: {
                title: "",
                content: "",
                image: "",
            }
        }
  */
  try {
    const about = await About.create(req.body);
    res.status(201).json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all about info
exports.getAllAbout = async (req, res) => {
  // #swagger.tags = ['about']
  try {
    const abouts = await About.findAll();
    res.status(200).json(abouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update about info
exports.updateAbout = async (req, res) => {
  // #swagger.tags = ['about']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'about data.',
            required: true,
            schema: {
                title: "",
                content: "",
                image: "",
            }
        }
  */
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ error: 'About info not found' });
    }

    await about.update(req.body);
    res.status(200).json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete about info
exports.deleteAbout = async (req, res) => {
  // #swagger.tags = ['about']
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ error: 'About info not found' });
    }

    await about.destroy();
    res.status(200).json({ message: 'About info deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
