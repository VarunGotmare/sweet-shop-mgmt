require('dotenv').config();
const { prisma, pool } = require('../lib/prisma');

beforeEach(async () => {
    await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE
            "Purchase",
            "Restock",
            "Sweet",
            "User"
        RESTART IDENTITY CASCADE;
    `);
});

afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
});
