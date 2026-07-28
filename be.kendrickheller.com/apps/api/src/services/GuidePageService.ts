import { prisma } from '@kendrickheller/core';

export class GuidePageService {
    public static async getGuidePages(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { guide_page_title: { contains: keyword, mode: 'insensitive' } },
                { guide_page_key: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.guidePage.count({ where: whereClause }),
            prisma.guidePage.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getGuidePageById(id: number) {
        return prisma.guidePage.findUnique({
            where: { guidePageId: id }
        });
    }

    public static async createGuidePage(data: any) {
        return prisma.guidePage.create({
            data: { ...data }
        });
    }

    public static async updateGuidePage(id: number, data: any) {
        return prisma.guidePage.update({
            where: { guidePageId: id },
            data: { ...data }
        });
    }

    public static async deleteGuidePage(id: number) {
        return prisma.guidePage.update({
            where: { guidePageId: id },
            data: { deleteFlg: 1 }
        });
    }
}
