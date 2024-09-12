const Service = require('../models/Service');

// Create a new service
exports.createService = async (req, res) => {
  // #swagger.tags = ['services']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Service data.',
            required: true,
            schema: {
                title: "Sample Service",
                subtitle: "Sample Subtitle",
                category: 1, 
                text: "Sample text",
                url: "http://example.com"
            }
        }
  */
  try {
    const { title, subtitle, category, text, url } = req.body;
    const newService = await Service.create({ title, subtitle, category, text, url });
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  // #swagger.tags = ['services']
  try {

    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const services = await Service.findAll({ where: filter });
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  // #swagger.tags = ['services']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Service data.',
            required: true,
            schema: {
                title: "Updated Service",
                subtitle: "Updated Subtitle",
                category: 1, 
                text: "Updated text",
                url: "http://updated-example.com"
            }
        }
  */
  try {
    const { title, subtitle, category, text, url } = req.body;
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.update({ title, subtitle, category, text, url });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  // #swagger.tags = ['services']
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.destroy();
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
