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

exports.getAllSweets = async ({ page = 1, limit = 10 }) => {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const [data, total] = await prisma.$transaction([
        prisma.sweet.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.sweet.count(),
    ]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};


exports.purchaseSweet = async (sweetId, quantity, userId) => {
    quantity = Number(quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
        const error = new Error('Invalid quantity');
        error.statusCode = 400;
        throw error;
    }

    return prisma.$transaction(async (tx) => {
        const sweet = await tx.sweet.findUnique({
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

        const updatedSweet = await tx.sweet.update({
            where: { id: sweetId },
            data: {
                quantity: {
                    decrement: quantity,
                },
            },
        });

        await tx.purchase.create({
            data: {
                userId,
                sweetId,
                quantity,
            },
        });

        return {
            remainingQuantity: updatedSweet.quantity,
        };
    });
};


exports.restockSweet = async (sweetId, quantity, adminId) => {
    quantity = Number(quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
        const error = new Error('Invalid quantity');
        error.statusCode = 400;
        throw error;
    }

    return prisma.$transaction(async (tx) => {
        const sweet = await tx.sweet.findUnique({
            where: { id: sweetId },
        });

        if (!sweet) {
            const error = new Error('Sweet not found');
            error.statusCode = 404;
            throw error;
        }

        const updatedSweet = await tx.sweet.update({
            where: { id: sweetId },
            data: {
                quantity: {
                    increment: quantity,
                },
            },
        });

        await tx.restock.create({
            data: {
                adminId,
                sweetId,
                quantity,
            },
        });

        return {
            updatedQuantity: updatedSweet.quantity,
        };
    });
};

exports.searchSweets = async (filters) => {
    const {
        name,
        category,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10,
    } = filters;

    const where = {};

    if (name) {
        where.name = {
            contains: name,
            mode: 'insensitive',
        };
    }

    if (category) {
        where.category = category;
    }

    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await prisma.$transaction([
        prisma.sweet.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
        }),
        prisma.sweet.count({ where }),
    ]);

    return {
        data,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        },
    };
};


exports.updateSweet = async (sweetId, data) => {
    const sweet = await prisma.sweet.findUnique({
        where: { id: sweetId },
    });

    if (!sweet) {
        const error = new Error('Sweet not found');
        error.statusCode = 404;
        throw error;
    }

    const allowedFields = ['name', 'category', 'price', 'quantity'];
    const updateData = {};

    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            updateData[key] = key === 'price'
                ? Number(data[key])
                : data[key];
        }
    }

    return prisma.sweet.update({
        where: { id: sweetId },
        data: updateData,
    });
};

exports.deleteSweet = async (sweetId) => {
    const sweet = await prisma.sweet.findUnique({
        where: { id: sweetId },
    });

    if (!sweet) {
        const error = new Error('Sweet not found');
        error.statusCode = 404;
        throw error;
    }

    await prisma.sweet.delete({
        where: { id: sweetId },
    });
};

