const { prisma } = require('../lib/prisma');

exports.getLogs = async ({ query }) => {
    const type = query.type || 'all';
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    if (type === 'purchase') {
        const [data, total] = await prisma.$transaction([
            prisma.purchase.findMany({
                skip,
                take: limit,
                orderBy: { purchaseDate: 'desc' },
                include: {
                    sweet: { select: { id: true, name: true } },
                    user: { select: { id: true, name: true } },
                },
            }),
            prisma.purchase.count(),
        ]);

        return {
            data: data.map(p => ({
                id: p.id,
                type: 'purchase',
                sweet: p.sweet,
                quantity: p.quantity,
                actor: p.user,
                createdAt: p.purchaseDate,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    if (type === 'restock') {
        const [data, total] = await prisma.$transaction([
            prisma.restock.findMany({
                skip,
                take: limit,
                orderBy: { restockDate: 'desc' },
                include: {
                    sweet: { select: { id: true, name: true } },
                    admin: { select: { id: true, name: true } },
                },
            }),
            prisma.restock.count(),
        ]);

        return {
            data: data.map(r => ({
                id: r.id,
                type: 'restock',
                sweet: r.sweet,
                quantity: r.quantity,
                actor: r.admin,
                createdAt: r.restockDate,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // type defaults to 'all'

    const [purchases, restocks, purchaseCount, restockCount] =
        await prisma.$transaction([
            prisma.purchase.findMany({
                include: {
                    sweet: { select: { id: true, name: true } },
                    user: { select: { id: true, name: true } },
                },
            }),
            prisma.restock.findMany({
                include: {
                    sweet: { select: { id: true, name: true } },
                    admin: { select: { id: true, name: true } },
                },
            }),
            prisma.purchase.count(),
            prisma.restock.count(),
        ]);

    const merged = [
        ...purchases.map(p => ({
            id: p.id,
            type: 'purchase',
            sweet: p.sweet,
            quantity: p.quantity,
            actor: p.user,
            createdAt: p.purchaseDate,
        })),
        ...restocks.map(r => ({
            id: r.id,
            type: 'restock',
            sweet: r.sweet,
            quantity: r.quantity,
            actor: r.admin,
            createdAt: r.restockDate,
        })),
    ];

    merged.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const paginated = merged.slice(skip, skip + limit);

    return {
        data: paginated,
        pagination: {
            page,
            limit,
            total: purchaseCount + restockCount,
            totalPages: Math.ceil((purchaseCount + restockCount) / limit),
        },
    };
};
