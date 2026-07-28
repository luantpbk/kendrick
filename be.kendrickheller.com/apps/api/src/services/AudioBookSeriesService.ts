import { prisma } from '@kendrickheller/core';

export class AudioBookSeriesService {
    public static async getAudioBookSeries(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { audio_book_series_title: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.audioBookSeries.count({ where: whereClause }),
            prisma.audioBookSeries.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getAudioBookSeriesById(id: number) {
        return prisma.audioBookSeries.findUnique({
            where: { audioBookSeriesId: id }
        });
    }

    public static async createAudioBookSeries(data: any) {
        return prisma.audioBookSeries.create({
            data: { ...data }
        });
    }

    public static async updateAudioBookSeries(id: number, data: any) {
        return prisma.audioBookSeries.update({
            where: { audioBookSeriesId: id },
            data: { ...data }
        });
    }

    public static async deleteAudioBookSeries(id: number) {
        return prisma.audioBookSeries.update({
            where: { audioBookSeriesId: id },
            data: { deleteFlg: 1 }
        });
    }
}
