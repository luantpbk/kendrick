import { prisma } from '@kendrickheller/core';

export class PrintedTemplateService {
    private static mapData(row: any) {
        if (!row) return null;
        const parsed = { ...row };
        try {
            if (parsed.printedSimpleParameter && typeof parsed.printedSimpleParameter === 'string') {
                parsed.printedSimpleParameter = JSON.parse(parsed.printedSimpleParameter);
            }
            if (parsed.printedTableParameter && typeof parsed.printedTableParameter === 'string') {
                parsed.printedTableParameter = JSON.parse(parsed.printedTableParameter);
            }
        } catch (e) {}
        // Convert BigInts to string if necessary, but we can also just let Express handle it.
        // Let's convert printedTemplateId to Number or String if needed.
        if (parsed.printedTemplateId) {
            parsed.printedTemplateId = Number(parsed.printedTemplateId);
        }
        return parsed;
    }

    public static async getPrintedTemplates(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { printedTemplateTitle: { contains: keyword, mode: 'insensitive' } },
                { printedTemplateKey: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.printedTemplate.count({ where: whereClause }),
            prisma.printedTemplate.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        // Convert BigInts if necessary, Prisma client handles this mostly but can be an issue with JSON serialization
        // Note: Express controllers usually stringify it. We assume BigInt serialization is handled in app.
        return { count: total, items: data.map(d => this.mapData(d)), page, size };
    }

    public static async getPrintedTemplateById(id: number | bigint) {
        const data = await prisma.printedTemplate.findUnique({
            where: { printedTemplateId: BigInt(id) }
        });
        return this.mapData(data);
    }

    public static async createPrintedTemplate(data: any) {
        return prisma.printedTemplate.create({
            data: { ...data }
        });
    }

    public static async updatePrintedTemplate(id: number | bigint, data: any) {
        return prisma.printedTemplate.update({
            where: { printedTemplateId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async deletePrintedTemplate(id: number | bigint) {
        return prisma.printedTemplate.update({
            where: { printedTemplateId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
