import { prisma } from '@kendrickheller/core';

export class PurchaseAccountService {
    public static async getPurchaseAccounts(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { accountName: { contains: keyword, mode: 'insensitive' } },
                { description: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.purchaseAccount.count({ where: whereClause }),
            prisma.purchaseAccount.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getPurchaseAccountById(id: number | bigint) {
        return prisma.purchaseAccount.findUnique({
            where: { purchaseAccountId: BigInt(id) }
        });
    }

    public static async createPurchaseAccount(data: any) {
        return prisma.purchaseAccount.create({
            data: { ...data }
        });
    }

    public static async updatePurchaseAccount(id: number | bigint, data: any) {
        return prisma.purchaseAccount.update({
            where: { purchaseAccountId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async deletePurchaseAccount(id: number | bigint) {
        return prisma.purchaseAccount.update({
            where: { purchaseAccountId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
