import { prisma } from '@kendrickheller/core';

export class ServiceService {
    public static async getAll(
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        const [total, data] = await Promise.all([
            prisma.service.count({ where: whereClause }),
            prisma.service.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getById(id: number) {
        return prisma.service.findUnique({
            where: { serviceId: BigInt(id) }
        });
    }

    public static async create(data: any) {
        return prisma.service.create({
            data: { ...data }
        });
    }

    public static async update(id: number, data: any) {
        return prisma.service.update({
            where: { serviceId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async delete(id: number) {
        return prisma.service.update({
            where: { serviceId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
