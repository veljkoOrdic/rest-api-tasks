// src/models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Task = sequelize.define('Task', {
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

// connection: the task belongs to user
Task.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Task, { foreignKey: 'userId' });

module.exports = Task;
