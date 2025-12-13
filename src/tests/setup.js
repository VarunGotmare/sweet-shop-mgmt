require('dotenv').config();
const prisma = require('../lib/prisma');

beforeEach(async () => {
    //clear users before testing
   await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});
