require('dotenv').config();
const {prisma,pool} = require('../lib/prisma');

beforeEach(async () => {
    //clear users before testing
   await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
});
