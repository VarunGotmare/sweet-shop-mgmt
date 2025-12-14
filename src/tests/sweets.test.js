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


    it('should allow a user to purchase a sweet and reduce quantity', async () => {
        //register normal user
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'User',
                email: 'user@test.com',
                password: 'password123',
            });

        //login user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user@test.com',
                password: 'password123',
            });

        const token = loginRes.body.token;

        //register & login admin (to create sweet)
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Admin',
                email: process.env.ADMIN_EMAILS.split(',')[0],
                password: 'password123',
            });

        const adminLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.ADMIN_EMAILS.split(',')[0],
                password: 'password123',
            });

        const adminToken = adminLogin.body.token;

        //admin creates sweet
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Ladoo',
                category: 'Indian',
                price: 10,
                quantity: 20,
            });

        const sweetId = sweetRes.body.id;

        //user purchases sweet
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                quantity: 5,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.remainingQuantity).toBe(15);
    });

    it('should allow admin to restock a sweet and increase quantity', async () => {
        //register admin
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Admin',
                email: process.env.ADMIN_EMAILS.split(',')[0],
                password: 'password123',
            });

        //login admin
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.ADMIN_EMAILS.split(',')[0],
                password: 'password123',
            });

        const token = loginRes.body.token;

        //create sweet
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Barfi',
                category: 'Indian',
                price: 15,
                quantity: 10,
            });

        const sweetId = sweetRes.body.id;

        //restock sweet
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                quantity: 20,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.updatedQuantity).toBe(30);
    });

    it('should search sweets by name and price range', async () => {
        //register & login admin
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Admin',
                email: process.env.ADMIN_EMAILS.split(',')[0],
                password: 'password123',
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.ADMIN_EMAILS.split(',')[0],
                password: 'password123',
            });

        const token = loginRes.body.token;

        //create sweets
        await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: 50,
                quantity: 20,
            });

        await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Gulab Jamun',
                category: 'Indian',
                price: 15,
                quantity: 30,
            });

        //search sweets
        const res = await request(app)
            .get('/api/sweets/search?name=choco&minPrice=30&maxPrice=60')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Chocolate Bar');
    });



});
