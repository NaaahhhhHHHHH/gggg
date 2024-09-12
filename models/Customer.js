const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    work: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ssn: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    service: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    card: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cvv: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    exp: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    hooks: {
        beforeCreate: async (customer) => {
            const salt = await bcrypt.genSalt(10);
            customer.password = await bcrypt.hash(customer.password, salt);
            customer.ssn = await bcrypt.hash(customer.ssn, salt);
            if (customer.card) {
                customer.card = await bcrypt.hash(customer.card, salt);
            }
        }
    }
});

module.exports = Customer;
