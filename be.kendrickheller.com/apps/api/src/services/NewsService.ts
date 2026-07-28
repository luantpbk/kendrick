import { prisma } from '@kendrickheller/core';

export class NewsService {
    public static async getNews(
        size: number = 20,
        page: number = 0,
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        const [total, data] = await Promise.all([
            prisma.news.count({ where: whereClause }),
            prisma.news.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return {
            count: total,
            items: data,
            page,
            size
        };
    }

    public static async getNewsById(id: number) {
        return prisma.news.findUnique({
            where: { newId: id }
        });
    }

    public static async createNews(data: any) {
        return prisma.news.create({
            data: { ...data }
        });
    }

    public static async updateNews(id: number, data: any) {
        return prisma.news.update({
            where: { newId: id },
            data: { ...data }
        });
    }

    public static async deleteNews(id: number) {
        return prisma.news.update({
            where: { newId: id },
            data: { deleteFlg: 1 }
        });
    }
}
