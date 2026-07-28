import { prisma } from '@kendrickheller/core';

export class NotificationTemplateService {
    private static mapData(row: any) {
        if (!row) return null;
        const parsed = { ...row };
        try {
            if (parsed.notificationParameter && typeof parsed.notificationParameter === 'string') {
                parsed.notificationParameter = JSON.parse(parsed.notificationParameter);
            }
        } catch (e) {}
        return parsed;
    }

    public static async getNotificationTemplates(
        size: number = 20,
        page: number = 0,
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        const [total, data] = await Promise.all([
            prisma.notificationTemplate.count({ where: whereClause }),
            prisma.notificationTemplate.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data.map(d => this.mapData(d)), page, size };
    }

    public static async getNotificationTemplateById(id: number) {
        const data = await prisma.notificationTemplate.findUnique({
            where: { notificationTemplateId: id }
        });
        return this.mapData(data);
    }

    public static async createNotificationTemplate(data: any) {
        return prisma.notificationTemplate.create({
            data: { ...data }
        });
    }

    public static async updateNotificationTemplate(id: number, data: any) {
        return prisma.notificationTemplate.update({
            where: { notificationTemplateId: id },
            data: { ...data }
        });
    }

    public static async deleteNotificationTemplate(id: number) {
        return prisma.notificationTemplate.update({
            where: { notificationTemplateId: id },
            data: { deleteFlg: 1 }
        });
    }
}
