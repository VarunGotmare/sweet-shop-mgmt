const { prisma } = require('../lib/prisma');

exports.createSweet = async ({ name, category, price, quantity }) => {
    const sweet = await prisma.sweet.create({
        data: {
            name,
            category,
            price,
            quantity,
        },
    });

    return sweet;
};

exports.getAllSweets = async () => {
    return prisma.sweet.findMany();
};
