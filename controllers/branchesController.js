const Branch = require('../models/Branch');

exports.createBranch = async (req, res) => {
  // #swagger.tags = ['branches']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'category data.',
            required: true,
            schema: {
                name: "",
                address: "",
                phoneNumber: "",
                email: "",
                openingHours: "",
                url: "",
            }
        }
  */
  try {
    const { name, address, phoneNumber, email, openingHours, url } = req.body;
    const newBranch = await Branch.create({ name, address, phoneNumber, email, openingHours, url });

    res.status(201).json({ message: 'Branch created successfully', newBranch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBranches = async (req, res) => {
  // #swagger.tags = ['branches']
  try {
    const branches = await Branch.findAll();
    res.status(200).json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBranch = async (req, res) => {
  // #swagger.tags = ['branches']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'category data.',
            required: true,
            schema: {
                name: "",
                address: "",
                phoneNumber: "",
                email: "",
                openingHours: "",
                url: "",
            }
        }
  */
  try {
    const { name, address, phoneNumber, email, openingHours, url } = req.body;
    const branch = await Branch.findByPk(req.params.id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    await branch.update({ name, address, phoneNumber, email, openingHours, url });
    res.status(200).json(branch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBranch = async (req, res) => {
  // #swagger.tags = ['branches']
  try {
    const branch = await Branch.findByPk(req.params.id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    await branch.destroy();
    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
