const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('Assignment', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'customers',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    meid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employees',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    eid: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
        validate: {
            notEmpty: false
        },
        references: {
            model: 'employees',
            key: 'id'
        }
    },
    sid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'services',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    formid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'forms',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: true,
    tableName: 'assignments'
});

module.exports = Assignment;
