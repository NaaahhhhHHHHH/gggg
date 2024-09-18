const Owner = require('../models/ownerModel');
const Employee = require('../models/employeeModel');
const Customer = require('../models/customerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login function for Employee, Owner, and Customer
exports.login = async (req, res) => {
    // #swagger.tags = ['auth']
    const { username, password, role } = req.body; // role can be 'employee', 'owner', or 'customer'

    try {
        let user;
        let userType;

        // Determine the user type based on role
        switch (role) {
            case 'employee':
                user = await Employee.findOne({ where: { username } });
                userType = 'Employee';
                break;
            case 'owner':
                user = await Owner.findOne({ where: { username } });
                userType = 'Owner';
                break;
            case 'customer':
                user = await Customer.findOne({ where: { username } });
                userType = 'Customer';
                break;
            default:
                return res.status(400).json({ message: 'Invalid role provided' });
        }

        // If user not found
        if (!user) {
            return res.status(400).json({ message: `${userType} not found with this username` });
        }

        const verification = true;
        if (userType == 'customer') {
            const verification = user.verification
        }

        // Check if the password is valid
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role,
                verification: verification
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with the token and user details
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role,
                verification: verification
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error while logging in', error: error.message });
    }
};
