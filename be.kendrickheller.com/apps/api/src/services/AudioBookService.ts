import { prisma } from '@kendrickheller/core';

export class AudioBookService {
    public static async getAudioBooks(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { audio_book_title: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.audioBook.count({ where: whereClause }),
            prisma.audioBook.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getAudioBookById(id: number) {
        return prisma.audioBook.findUnique({
            where: { audioBookId: id }
        });
    }

    public static async createAudioBook(data: any) {
        return prisma.audioBook.create({
            data: { ...data }
        });
    }

    public static async updateAudioBook(id: number, data: any) {
        return prisma.audioBook.update({
            where: { audioBookId: id },
            data: { ...data }
        });
    }

    public static async deleteAudioBook(id: number) {
        return prisma.audioBook.update({
            where: { audioBookId: id },
            data: { deleteFlg: 1 }
        });
    }
}
