import { prisma } from '@kendrickheller/core';

export class AccountBalanceService {
    public static async getAll(
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        const [total, data] = await Promise.all([
            prisma.accountBalance.count({ where: whereClause }),
            prisma.accountBalance.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getById(id: number) {
        return prisma.accountBalance.findUnique({
            where: { userId: BigInt(id) }
        });
    }

    public static async create(data: any) {
        return prisma.accountBalance.create({
            data: { ...data }
        });
    }

    public static async update(id: number, data: any) {
        return prisma.accountBalance.update({
            where: { userId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async delete(id: number) {
        return prisma.accountBalance.update({
            where: { userId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
