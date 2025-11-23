// src/routes/tasks.js
const express = require('express');
const Task = require('../models/Task');
const currentUser = require('../middleware/currentUser');

const router = express.Router();

/**
 * Creating task
 * - basic user can
 * - admin cant
 */
router.post('/', currentUser, async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            return res.status(403).json({ message: 'Admin can`t create Tasks.' });
        }

        const { body } = req.body;

        const task = await Task.create({
            body,
            userId: req.user.id,
        });

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
});

/**
 * Listing Tasks with pagination and sorting
 * Query params:
 *  - page (default 1)
 *  - limit (default 10)
 *  - sort (asc | desc) per createdAt
 *
 * basic: can see only his tasks
 * admin: can see all the tasks
 */
router.get('/', currentUser, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort === 'asc' ? 'ASC' : 'DESC'; // default DESC (earlies first)

        const offset = (page - 1) * limit;

        const where = {};

        if (req.user.role === 'basic') {
            where.userId = req.user.id;
        }

        const { rows: tasks, count } = await Task.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', sort]],
        });

        res.json({
            data: tasks,
            pagination: {
                page,
                limit,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Update task
 * - basic: can update only his tasks
 * - admin: can update every task
 */
router.patch('/:id', currentUser, async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.user.role === 'basic' && task.userId !== req.user.id) {
            return res.status(403).json({ message: 'Can change only your tasks.' });
        }

        if (req.body.body !== undefined) {
            task.body = req.body.body;
        }

        await task.save();
        res.json(task);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
