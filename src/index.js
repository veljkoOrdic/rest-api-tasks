// src/index.js
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const sequelize = require('./db');

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await sequelize.authenticate();
        console.log('DB connected');

        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to start server:', err);
        process.exit(1);
    }
}

start();
