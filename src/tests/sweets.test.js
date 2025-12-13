const request = require('supertest');
const app = require('../server');

describe('Sweets: Create', () => {

    it('should allow admin to create a sweet', async () => {
        // reg admin
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Admin',
                email: process.env.ADMIN_EMAILS.split(',')[0],
                password: 'password123',
            });

        // loginn
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.ADMIN_EMAILS.split(',')[0],
                password: 'password123',
            });

        const token = loginRes.body.token;

        //create sweet
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: 50,
                quantity: 100,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Chocolate Bar');
        expect(res.body.category).toBe('Chocolate');
        expect(res.body.price).toBe('50');
        expect(res.body.quantity).toBe(100);
    });

});
