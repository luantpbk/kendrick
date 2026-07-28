import { prisma } from '@kendrickheller/core';

export class OrderRequirementService {
    public static async getOrderRequirements(
        size: number = 20,
        page: number = 0,
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        const [total, data] = await Promise.all([
            prisma.orderRequirement.count({ where: whereClause }),
            prisma.orderRequirement.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getOrderRequirementById(id: number) {
        return prisma.orderRequirement.findUnique({
            where: { orderRequirementId: id }
        });
    }

    public static async createOrderRequirement(data: any) {
        return prisma.orderRequirement.create({
            data: { ...data }
        });
    }

    public static async updateOrderRequirement(id: number, data: any) {
        return prisma.orderRequirement.update({
            where: { orderRequirementId: id },
            data: { ...data }
        });
    }

    public static async deleteOrderRequirement(id: number) {
        return prisma.orderRequirement.update({
            where: { orderRequirementId: id },
            data: { deleteFlg: 1 }
        });
    }
}
