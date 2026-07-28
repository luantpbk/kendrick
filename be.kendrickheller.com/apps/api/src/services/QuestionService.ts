import { prisma } from '@kendrickheller/core';

export class QuestionService {
    public static async getQuestions(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { questionTitle: { contains: keyword, mode: 'insensitive' } },
                { questionValue: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.question.count({ where: whereClause }),
            prisma.question.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getQuestionById(id: number | bigint) {
        return prisma.question.findUnique({
            where: { questionId: BigInt(id) }
        });
    }

    public static async createQuestion(data: any) {
        return prisma.question.create({
            data: { ...data }
        });
    }

    public static async updateQuestion(id: number | bigint, data: any) {
        return prisma.question.update({
            where: { questionId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async deleteQuestion(id: number | bigint) {
        return prisma.question.update({
            where: { questionId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
