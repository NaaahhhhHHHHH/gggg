const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee = require('./employeeModel');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    serviceid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reassignment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    employeeId: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'id',
        },
    },
}, {
    tableName: 'Role',
});

Role.belongsTo(Employee, { foreignKey: 'employeeId' });

module.exports = Role;
