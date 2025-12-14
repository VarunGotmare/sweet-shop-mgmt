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

exports.purchaseSweet = async (sweetId, quantity) => {
    quantity = parseInt(quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
        const error = new Error('Invalid quantity');
        error.statusCode = 400;
        throw error;
    }
    const sweet = await prisma.sweet.findUnique({
        where: { id: sweetId },
    });
    if (!sweet) {
        const error = new Error('Sweet not found');
        error.statusCode = 404;
        throw error;
    }
    if (sweet.quantity < quantity) {
        const error = new Error('Insufficient sweet quantity');
        error.statusCode = 400;
        throw error;
    }
    const updatedSweet = await prisma.sweet.update({
        where: { id: sweetId },
        data: {
            quantity: {
                decrement: quantity,
            }
        },
    });
    return {
        remainingQuantity: updatedSweet.quantity
    };

};

exports.restockSweet = async (sweetId, quantity) => {
    quantity = parseInt(quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
        const error = new Error('Invalid quantity');
        error.statusCode = 400;
        throw error;
    }
    const sweet = await prisma.sweet.findUnique({
        where: { id: sweetId },
    });
    if(!sweet) {
        const error = new Error('Sweet not found');
        error.statusCode = 404;
        throw error;
    }
    const updatedSweet = await prisma.sweet.update({
        where: { id: sweetId },
        data: {
            quantity: {
                increment: quantity,
            }
    },
    });
    return {
        updatedQuantity: updatedSweet.quantity,
    };
}