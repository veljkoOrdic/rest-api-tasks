// src/middleware/currentUser.js
const User = require('../models/User');

async function currentUser(req, res, next) {
    const userId = req.header('x-user-id');

    if (!userId) {
        return res.status(401).json({ message: 'Missing x-user-id header' });
    }

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = currentUser;
