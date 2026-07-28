import { prisma } from '@kendrickheller/core';

export class EmailService {
    public static async getEmails(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { email_title: { contains: keyword, mode: 'insensitive' } },
                { receiver: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.email.count({ where: whereClause }),
            prisma.email.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getEmailById(id: number) {
        return prisma.email.findUnique({
            where: { emailId: id }
        });
    }

    public static async createEmail(data: any) {
        return prisma.email.create({
            data: { ...data }
        });
    }

    public static async updateEmail(id: number, data: any) {
        return prisma.email.update({
            where: { emailId: id },
            data: { ...data }
        });
    }

    public static async deleteEmail(id: number) {
        return prisma.email.update({
            where: { emailId: id },
            data: { deleteFlg: 1 }
        });
    }
}
