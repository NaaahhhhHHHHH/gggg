const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Employee = require('./employeeModel');
const Service = require('./serviceModel');
const Job = require('./jobModel');

const Assignment = sequelize.define('Assignment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    sid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Service,
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE'
    },
    payment: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
    },
    // pay2: {
    //     type: DataTypes.FLOAT,
    //     allowNull: false,
    //     defaultValue: 0.0,
    //     comment: 'Fixed additional payment (not including percentage pay)'
    // },
    jid: {
        type: DataTypes.INTEGER,
        references: {
          model: Job,
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE'
    },
    reassignment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Accepted', 'Decline', 'Waitting', 'Expired'),
        allowNull: false,
        defaultValue: 'Waitting',
        comment: 'The current status of the assignment',
    },
    expire: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 3,
    },
    eId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
}, {
    tableName: 'assignments',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['jid', 'eId']
        }
    ]
});

Assignment.belongsTo(Employee, { foreignKey: 'eId' });

module.exports = Assignment;
