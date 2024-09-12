const Employee = require('../models/employeeModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get a list of all employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employees list', error: err.message });
    }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
    const { username, password, email, mobile, work } = req.body;

    try {
        // Check if the username already exists
        const existingEmployee = await Employee.findOne({ where: { username } });

        if (existingEmployee) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new employee record
        const newEmployee = await Employee.create({
            username,
            password,
            email,
            mobile,
            work,
        });

        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (err) {
        res.status(500).json({ message: 'Error creating employee', error: err.message });
    }
};

// Update an employee's information
exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { username, email, mobile, work, password } = req.body;

    try {
        // Find the employee by ID
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update employee details
        employee.username = username || employee.username;
        employee.email = email || employee.email;
        employee.mobile = mobile || employee.mobile;
        employee.work = work || employee.work;
        
        // If a new password is provided, hash it before updating
        if (password) {
            const salt = await bcrypt.genSalt(10);
            employee.password = await bcrypt.hash(password, salt);
        }

        await employee.save();
        res.json({ message: 'Employee information updated successfully', employee });
    } catch (err) {
        res.status(500).json({ message: 'Error updating employee', error: err.message });
    }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the employee by ID
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Delete the employee record
        await employee.destroy();
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting employee', error: err.message });
    }
};

// Employee login
exports.loginEmployee = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the employee by username
        const employee = await Employee.findOne({ where: { username } });

        if (!employee) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check if the password matches
        const isMatch = await employee.validPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: employee.id, username: employee.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};
