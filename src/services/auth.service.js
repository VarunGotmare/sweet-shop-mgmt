const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');


exports.register = async ({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });


    const { password: _, ...safeUser } = user;
    return safeUser;
};