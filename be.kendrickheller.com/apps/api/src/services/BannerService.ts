import { prisma } from '@kendrickheller/core';
import { FileHelper } from '../utils/FileHelper';

export class BannerService {
    public static async getBanners(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0,
            objectType: 4 // EnumImageType.Banner
        };

        if (keyword) {
            whereClause.OR = [
                { fileName: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const files = await prisma.file.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        return files.map(FileHelper.mapToFileDto).filter(f => f !== null);
    }

    public static async getBannerById(id: number) {
        return prisma.file.findUnique({
            where: { fileId: BigInt(id) }
        });
    }

    public static async createBanner(data: any) {
        return prisma.file.create({
            data: { ...data, objectType: 4 }
        });
    }

    public static async updateBanner(id: number, data: any) {
        return prisma.file.update({
            where: { fileId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async deleteBanner(id: number) {
        return prisma.file.update({
            where: { fileId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
