const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models/User');
const Customer = require('../models/Customer');

exports.register = async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'register new account'
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'user data.',
            required: true,
            schema: {
                username: "",
                name: "",
                email: "",
                password: "",
                phoneNumber: "",
                address: "",
                profileImage: "",
                role: "",
            }
        }
  */
  try {
    const { username, name, email, password, phoneNumber, role, address, profileImage } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const newUser = await User.create({
      username,
      name,
      email,
      password,
      phoneNumber,
      role,
      address,
      profileImage,
    });

    if (role !== 'admin') {
      let customer = await Customer.findOne({ where: { email } });
      if (!customer) {
        customer = await Customer.create({
          name,
          email,
          phoneNumber,
        });
      }
    }
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginCustomer = async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'login for customer'
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'user data.',
            required: true,
            schema: {
                emailOrUsername: "",
                password: "",
            }
        }
  */
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
        role: 'customer'
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user.id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'login for admin'
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'user data.',
            required: true,
            schema: {
                emailOrUsername: "",
                password: "",
            }
        }
  */
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
        role: 'admin'
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user.id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'update user info'
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'category data.',
            required: true,
            schema: {
                name: "",
                phoneNumber: "",
                address: "",
                profileImage: "",
            }
        }
  */
  try {
    const { address, profileImage, name, phoneNumber } = req.body;
    const user = await User.update(
      { address, profileImage, name, phoneNumber },
      { where: { id: req.params.id }, returning: true }
    );

    if (!user[0]) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'update user password'
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'user data.',
            required: true,
            schema: {
                currentPassword: "",
                newPassword: "",
            }
        }
  */
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'get user list'
  try {
    const { username, email, phoneNumber, name, role } = req.query;
    const filter = {};
    if (username) filter.username = username;
    if (name) filter.name = { [Op.iLike]: `%${name}%` };
    if (email) filter.email = email;
    if (phoneNumber) filter.phoneNumber = phoneNumber;
    if (role) filter.role = role;

    const users = await User.findAll({ where: filter });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'delete user'
  try {
    const id = req.params.id;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.destroy({ where: { id: id } });
    await Customer.destroy({ where: { email: user.email } });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
