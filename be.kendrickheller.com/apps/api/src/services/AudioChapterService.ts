import { prisma } from '@kendrickheller/core';

export class AudioChapterService {
    public static async getAudioChapters(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { audio_chapter_title: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.audioChapter.count({ where: whereClause }),
            prisma.audioChapter.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getAudioChapterById(id: number) {
        return prisma.audioChapter.findUnique({
            where: { audioChapterId: id }
        });
    }

    public static async createAudioChapter(data: any) {
        return prisma.audioChapter.create({
            data: { ...data }
        });
    }

    public static async updateAudioChapter(id: number, data: any) {
        return prisma.audioChapter.update({
            where: { audioChapterId: id },
            data: { ...data }
        });
    }

    public static async deleteAudioChapter(id: number) {
        return prisma.audioChapter.update({
            where: { audioChapterId: id },
            data: { deleteFlg: 1 }
        });
    }
}
