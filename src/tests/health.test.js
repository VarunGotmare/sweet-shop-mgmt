//this is a test of test for test driven development (see whatt i did there)

const request = require('supertest');   
const app = require('../server');  
describe('GET /health', () => {
    it('should return 200 OK with healthy status', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBe(true);
    });
});
