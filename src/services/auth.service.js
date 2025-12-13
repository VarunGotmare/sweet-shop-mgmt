const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

exports.register = async ({ name, email, password }) => {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        const error = new Error('User already exists');
        error.statusCode = 409;
        throw error;
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map(e => e.trim());

    const role = adminEmails.includes(email) ? 'ADMIN' : 'USER';


    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
    });


    const { password: _, ...safeUser } = user;
    return safeUser;
};
