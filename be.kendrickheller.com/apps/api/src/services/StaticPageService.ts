import { prisma } from '@kendrickheller/core';

export class StaticPageService {
    public static async getAll() {
        const data = await prisma.staticPage.findMany({
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
        const sanitizedData = { ...data };
        if (sanitizedData.staticPageId === null || sanitizedData.staticPageId === undefined) {
            delete sanitizedData.staticPageId;
        }
        if (sanitizedData.displayOrder !== undefined && sanitizedData.displayOrder !== null) {
            sanitizedData.displayOrder = Number(sanitizedData.displayOrder);
        }
        return prisma.staticPage.create({
            data: sanitizedData
        });
    }

    public static async update(id: number, data: any) {
        return prisma.staticPage.update({
            where: { staticPageId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async delete(id: number) {
        return prisma.staticPage.delete({
            where: { staticPageId: BigInt(id) }
        });
    }
}
