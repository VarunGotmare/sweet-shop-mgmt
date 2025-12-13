const {prisma} = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

exports.login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }
    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    const { password: _, ...safeUser } = user;
    return { token, user: safeUser};
};
