// src/routes/users.js
const express = require('express');
const User = require('../models/User');
const currentUser = require('../middleware/currentUser');

const router = express.Router();

/**
 * Creating user (signup).
 * For example using to create one admin and a couple of users
 */
router.post('/', async (req, res, next) => {
    try {
        const { firstName, lastName, username, email, password, role } = req.body;

        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password,
            role: role || 'basic',
        });

        res.status(201).json(user);
    } catch (err) {
        // unique constraint violation
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'Username or email already exist.',
            });
        }
        next(err);
    }
});

/**
 * Get current User (with x-user-id)
 */
router.get('/me', currentUser, async (req, res) => {
    res.json(req.user);
});

/**
 * User can update only his tasks
 */
router.patch('/me', currentUser, async (req, res, next) => {
    try {
        const allowedFields = ['firstName', 'lastName', 'username', 'email', 'password'];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                req.user[field] = req.body[field];
            }
        });

        await req.user.save();
        res.json(req.user);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'Username or email already exist.',
            });
        }
        next(err);
    }
});

/**
 * Only Admin can update data of any User
 */
router.patch('/:id', currentUser, async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can update other users.' });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const allowedFields = ['firstName', 'lastName', 'username', 'email', 'password', 'role'];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save();
        res.json(user);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'Username or email already exist.',
            });
        }
        next(err);
    }
});

module.exports = router;
