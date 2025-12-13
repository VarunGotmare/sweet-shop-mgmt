const request = require('supertest');
const app = require('../server');

describe('Auth: Register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe('test@example.com');
        expect(res.body).not.toHaveProperty('password');
    });
});
