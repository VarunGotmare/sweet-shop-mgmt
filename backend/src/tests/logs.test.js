const request = require('supertest');
const app = require('../server');

describe('Logs: Admin Audit', () => {

    it('should allow admin to fetch combined logs (purchases + restocks)', async () => {
        // register admin
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Admin',
                email: process.env.ADMIN_EMAILS.split(',')[0],
                password: 'password123',
            });

        // login admin
        const adminLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.ADMIN_EMAILS.split(',')[0],
                password: 'password123',
            });

        const adminToken = adminLogin.body.token;

        // register user
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'User',
                email: 'user@test.com',
                password: 'password123',
            });

        // login user
        const userLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user@test.com',
                password: 'password123',
            });

        const userToken = userLogin.body.token;

        // admin creates sweet
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Motichoor Ladoo',
                category: 'Indian',
                price: 10,
                quantity: 20,
            });

        const sweetId = sweetRes.body.id;

        // user purchases sweet
        await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 5 });

        // admin restocks sweet
        await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 10 });

        // admin fetches logs
        const res = await request(app)
            .get('/api/logs?type=all&page=1&limit=10')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('pagination');

        expect(res.body.data.length).toBe(2);

        const types = res.body.data.map(log => log.type);
        expect(types).toContain('purchase');
        expect(types).toContain('restock');
    });

    it('should forbid normal users from accessing logs', async () => {
        // register user
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'User',
                email: 'blocked@test.com',
                password: 'password123',
            });

        // login user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'blocked@test.com',
                password: 'password123',
            });

        const token = loginRes.body.token;

        const res = await request(app)
            .get('/api/logs')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(403);
    });

});
