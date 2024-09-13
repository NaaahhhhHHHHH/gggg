const Customer = require('../models/customerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all customers
exports.getCustomers = async (req, res) => {
    // #swagger.tags = ['customer']
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
};

// Fetch a specific customer's details by ID
exports.getCustomerById = async (req, res) => {
    // #swagger.tags = ['customer']
    const { id } = req.params;

    try {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching Customer', error: err.message });
    }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
    // #swagger.tags = ['customer']
    const { name, username, password, email, mobile, work, ssn, service, card, cvv, exp } = req.body;

    try {
        const existingCustomer = await Customer.findOne({ where: { username } });

        if (existingCustomer) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newCustomer = await Customer.create({
            name,
            username,
            password,
            email,
            mobile,
            work,
            ssn,
            service,
            card,
            cvv,
            exp,
        });

        res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
    } catch (err) {
        res.status(500).json({ message: 'Error creating customer', error: err.message });
    }
};

// Update customer information
exports.updateCustomer = async (req, res) => {
    // #swagger.tags = ['customer']
    const { id } = req.params;
    const { name, username, password, email, mobile, work, ssn, service, card, cvv, exp } = req.body;

    try {
        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update customer fields
        customer.name = name || customer.name;
        customer.username = username || customer.username;
        customer.email = email || customer.email;
        customer.mobile = mobile || customer.mobile;
        customer.work = work || customer.work;
        customer.service = service || customer.service;

        // Encrypt and update sensitive fields if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            customer.password = await bcrypt.hash(password, salt);
        }
        if (ssn) {
            const salt = await bcrypt.genSalt(10);
            customer.ssn = await bcrypt.hash(ssn, salt);
        }
        if (card) {
            const salt = await bcrypt.genSalt(10);
            customer.card = await bcrypt.hash(card, salt);
        }
        if (cvv) {
            customer.cvv = cvv;
        }
        if (exp) {
            customer.exp = exp;
        }

        await customer.save();
        res.json({ message: 'Customer updated successfully', customer });
    } catch (err) {
        res.status(500).json({ message: 'Error updating customer', error: err.message });
    }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
    // #swagger.tags = ['customer']
    const { id } = req.params;

    try {
        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.destroy();
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting customer', error: err.message });
    }
};
