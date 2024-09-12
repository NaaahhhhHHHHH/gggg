const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Form = sequelize.define('Form', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    cid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    sid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'services',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
}, {
    timestamps: true,
    tableName: 'forms',
});

module.exports = Form;
