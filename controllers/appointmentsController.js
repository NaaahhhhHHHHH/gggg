const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Customer = require('../models/Customer');
// const Service = require('../models/Service');
// const Employee = require('../models/Employee');
// const Branch = require('../models/Branch');

exports.createAppointment = async (req, res) => {
  // #swagger.tags = ['appointments']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Appointment data.',
            required: true,
            schema: {
                userId: "",
                name: "",
                email: "",
                phoneNumber: "",
                service: "",
                employee: "",
                branch: "",
                timeslot: "",
            }
        }
  */
  try {
    const { userId, name, email, phoneNumber, service, employee, branch, timeslot } = req.body;
    let customer;
    let user;

    if (userId) {
      user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (req.user.role != 'admin' && userId != req.user.id) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      customer = await Customer.findOne({ where: { email: user.email } });
      if (!customer) {
        customer = await Customer.create({
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
        });
      }
    } else {
      customer = await Customer.findOne({ where: { email } });
      if (!customer) {
        customer = await Customer.create({ name, email, phoneNumber });
      }
    }

    const newAppointment = await Appointment.create({
      userId: userId || null,
      name: userId ? user.name : name,
      email: userId ? user.email : email,
      phoneNumber: userId ? user.phoneNumber : phoneNumber,
      service,
      employee: employee || null,
      branch,
      timeslot,
    });

    res.status(201).json({ message: 'Appointment created successfully', appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  // #swagger.tags = ['appointments']
  try {
    const { userId, service, employee, phoneNumber, name, branch, timeslot } = req.query;

    if (req.user.role != 'admin' && userId != req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const filter = {};
    if (userId) filter.userId = userId;
    if (name) filter.name = { [Op.iLike]: `%${name}%` };
    if (service) filter.service = service;
    if (employee) filter.employee = employee;
    if (branch) filter.branch = branch;
    if (timeslot) filter.timeslot = timeslot;
    if (phoneNumber) filter.phoneNumber = phoneNumber;

    const appointments = await Appointment.findAll({
      where: filter
    });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  // #swagger.tags = ['appointments']
  /* 
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Appointment data.',
            required: true,
            schema: {
                userId: "",
                name: "",
                email: "",
                phoneNumber: "",
                service: "",
                employee: "",
                branch: "",
                timeslot: "",
            }
        }
  */
  try {
    const { userId, name, email, phoneNumber, service, employee, branch, timeslot } = req.body;

    if (req.user.role != 'admin' && userId != req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.update({
      userId,
      name,
      email,
      phoneNumber,
      service,
      employee: employee || null,
      branch,
      timeslot,
    });

    res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  // #swagger.tags = ['appointments']
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (req.user.role != 'admin' && appointment.userId != req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await appointment.destroy();
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
