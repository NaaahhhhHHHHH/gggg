const Customer = require('../models/Customer');
const { Op } = require('sequelize');

// Create a new customer
exports.createCustomer = async (req, res) => {
  // #swagger.tags = ['customers']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'customers data.',
            required: true,
            schema: {
                name: "hung",
                email: "1234",
                phoneNumber: "123456789"
            }
        }
  */
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => { 
  // #swagger.tags = ['customers']
  try {
    const { name, email, phoneNumber } = req.query;
    const filter = {};

    if (name) filter.name = { [Op.iLike]: `%${name}%` };
    if (email) filter.email = email;
    if (phoneNumber) filter.phoneNumber = phoneNumber;

    const customers = await Customer.findAll({ where: filter });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  // #swagger.tags = ['customers']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'customers data.',
            required: true,
            schema: {
                name: "hung",
                email: "1234",
                phoneNumber: "123456789"
            }
        }
  */
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await customer.update(req.body);
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  // #swagger.tags = ['customers']
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await customer.destroy();
    res.status(200).json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
