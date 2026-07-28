import { prisma } from '@kendrickheller/core';

export class StaticPageService {
    public static async getAll() {
        const whereClause: any = {
            deleteFlg: 0
        };

        const data = await prisma.staticPage.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        return data;
    }

    public static async getById(id: number) {
        return prisma.staticPage.findUnique({
            where: { staticPageId: BigInt(id) }
        });
    }

    public static async getByKey(key: string) {
        return prisma.staticPage.findFirst({
            where: { staticPageKey: key }
        });
    }

    public static async create(data: any) {
        return prisma.staticPage.create({
            data: { ...data }
        });
    }

    public static async update(id: number, data: any) {
        return prisma.staticPage.update({
            where: { staticPageId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async delete(id: number) {
        return prisma.staticPage.update({
            where: { staticPageId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
