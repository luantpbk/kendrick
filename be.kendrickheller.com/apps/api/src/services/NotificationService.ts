import { prisma } from '@kendrickheller/core';

export class NotificationService {
    public static async getNotifications(
        size: number = 20,
        page: number = 0,
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        const [total, data] = await Promise.all([
            prisma.notification.count({ where: whereClause }),
            prisma.notification.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getNotificationById(id: number) {
        return prisma.notification.findUnique({
            where: { notificationId: id }
        });
    }

    public static async createNotification(data: any) {
        return prisma.notification.create({
            data: { ...data }
        });
    }

    public static async updateNotification(id: number, data: any) {
        return prisma.notification.update({
            where: { notificationId: id },
            data: { ...data }
        });
    }

    public static async deleteNotification(id: number) {
        return prisma.notification.update({
            where: { notificationId: id },
            data: { deleteFlg: 1 }
        });
    }
}
