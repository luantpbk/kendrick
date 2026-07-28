import { prisma } from '@kendrickheller/core';

export class EmailTemplateService {
    private static mapData(row: any) {
        if (!row) return null;
        const parsed = { ...row };
        try {
            if (parsed.emailSimpleParameter && typeof parsed.emailSimpleParameter === 'string') {
                parsed.emailSimpleParameter = JSON.parse(parsed.emailSimpleParameter);
            }
            if (parsed.emailTableParameter && typeof parsed.emailTableParameter === 'string') {
                parsed.emailTableParameter = JSON.parse(parsed.emailTableParameter);
            }
        } catch (e) {}
        return parsed;
    }

    public static async getEmailTemplates(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { email_template_title: { contains: keyword, mode: 'insensitive' } },
                { email_template_key: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.emailTemplate.count({ where: whereClause }),
            prisma.emailTemplate.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data.map(d => this.mapData(d)), page, size };
    }

    public static async getEmailTemplateById(id: number) {
        const data = await prisma.emailTemplate.findUnique({
            where: { emailTemplateId: id }
        });
        return this.mapData(data);
    }

    public static async createEmailTemplate(data: any) {
        return prisma.emailTemplate.create({
            data: { ...data }
        });
    }

    public static async updateEmailTemplate(id: number, data: any) {
        return prisma.emailTemplate.update({
            where: { emailTemplateId: id },
            data: { ...data }
        });
    }

    public static async deleteEmailTemplate(id: number) {
        return prisma.emailTemplate.update({
            where: { emailTemplateId: id },
            data: { deleteFlg: 1 }
        });
    }
}
