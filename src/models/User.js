// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // cant two same usernames
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // can`t two same emails
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('basic', 'admin'),
        allowNull: false,
        defaultValue: 'basic',
    },
});

module.exports = User;
