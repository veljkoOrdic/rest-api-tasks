const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/db');

describe('Tasks API e2e', () => {
    let adminUser;
    let basicUser;

    beforeAll(async () => {
        // čistimo i kreiramo tabele za test
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('create admin and basic user, create task, list tasks', async () => {
        // 1) Kreiraj admin user-a
        let res = await request(app)
            .post('/users')
            .send({
                firstName: 'Admin',
                lastName: 'User',
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
            });

        expect(res.statusCode).toBe(201);
        adminUser = res.body;
        expect(adminUser.role).toBe('admin');

        // 2) Kreiraj basic user-a
        res = await request(app)
            .post('/users')
            .send({
                firstName: 'Basic',
                lastName: 'User',
                username: 'basic',
                email: 'basic@example.com',
                password: 'basic123',
                role: 'basic',
            });

        expect(res.statusCode).toBe(201);
        basicUser = res.body;
        expect(basicUser.role).toBe('basic');

        // 3) Basic user kreira task
        res = await request(app)
            .post('/tasks')
            .set('x-user-id', basicUser.id)
            .send({ body: 'My first task' });

        expect(res.statusCode).toBe(201);
        const task = res.body;
        expect(task.body).toBe('My first task');
        expect(task.userId).toBe(basicUser.id);

        // 4) Basic user list svoj task
        res = await request(app)
            .get('/tasks')
            .set('x-user-id', basicUser.id);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].body).toBe('My first task');

        // 5) Admin lista sve taskove (treba da vidi 1 task)
        res = await request(app)
            .get('/tasks')
            .set('x-user-id', adminUser.id);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
    });

    test('admin cannot create task', async () => {
        const res = await request(app)
            .post('/tasks')
            .set('x-user-id', adminUser.id)
            .send({ body: 'Admin task' });

        expect(res.statusCode).toBe(403);
    });
});
