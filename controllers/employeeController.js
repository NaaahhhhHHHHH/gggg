const Employee = require('../models/employeeModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fetch the list of all employees
exports.getEmployees = async (req, res) => {
    // #swagger.tags = ['employee']
    try {
        const employees = await Employee.findAll();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employee list', error: err.message });
    }
};

// Fetch a specific employee's details by ID
exports.getEmployeeById = async (req, res) => {
    // #swagger.tags = ['employee']
    const { id } = req.params;

    try {
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employee', error: err.message });
    }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
    // #swagger.tags = ['employee']
    const { name, username, password, email, mobile, work } = req.body;

    try {
        // Check if the username or email already exists
        const existingEmployee = await Employee.findOne({ where: { username } }) ||
                                 await Employee.findOne({ where: { email } });

        if (existingEmployee) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEmployee = await Employee.create({
            name,
            username,
            password: hashedPassword,
            email,
            mobile,
            work,
        });

        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (err) {
        res.status(500).json({ message: 'Error creating employee', error: err.message });
    }
};

// Update employee information
exports.updateEmployee = async (req, res) => {
    // #swagger.tags = ['employee']
    const { id } = req.params;
    const { name, username, password, email, mobile, work } = req.body;

    try {
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update employee fields
        employee.name = name || employee.name;
        employee.username = username || employee.username;
        employee.email = email || employee.email;
        employee.mobile = mobile || employee.mobile;
        employee.work = work || employee.work;

        // If password is provided, hash it before saving
        if (password) {
            const salt = await bcrypt.genSalt(10);
            employee.password = await bcrypt.hash(password, salt);
        }

        await employee.save();
        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (err) {
        res.status(500).json({ message: 'Error updating employee', error: err.message });
    }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
    // #swagger.tags = ['employee']
    const { id } = req.params;

    try {
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.destroy();
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting employee', error: err.message });
    }
};
