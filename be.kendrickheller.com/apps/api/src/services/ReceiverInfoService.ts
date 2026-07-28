import { prisma } from '@kendrickheller/core';

export class ReceiverInfoService {
    public static async getReceiverInfos(
        keyword?: string,
        size: number = 20,
        page: number = 0,
        userId?: number | bigint
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (userId) {
            whereClause.userId = BigInt(userId);
        }

        if (keyword) {
            whereClause.OR = [
                { fullname: { contains: keyword, mode: 'insensitive' } },
                { phoneNumber: { contains: keyword, mode: 'insensitive' } },
                { address1: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.receiverInfo.count({ where: whereClause }),
            prisma.receiverInfo.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getReceiverInfoById(id: number | bigint) {
        return prisma.receiverInfo.findUnique({
            where: { receiverInfoId: BigInt(id) }
        });
    }

    public static async createReceiverInfo(data: any) {
        if (data.userId) data.userId = BigInt(data.userId);
        return prisma.receiverInfo.create({
            data: { ...data }
        });
    }

    public static async updateReceiverInfo(id: number | bigint, data: any) {
        if (data.userId) data.userId = BigInt(data.userId);
        return prisma.receiverInfo.update({
            where: { receiverInfoId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async deleteReceiverInfo(id: number | bigint) {
        return prisma.receiverInfo.update({
            where: { receiverInfoId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
