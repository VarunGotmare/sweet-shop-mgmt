require('dotenv').config();
const { prisma, pool } = require('../lib/prisma');

beforeEach(async () => {
    //clear users before testing
    await prisma.purchase.deleteMany();
    await prisma.restock.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
});
