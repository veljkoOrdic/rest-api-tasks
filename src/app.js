// src/app.js
const express = require('express');
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(express.json());

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
