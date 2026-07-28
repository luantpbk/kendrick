import { prisma } from '@kendrickheller/core';
import { FileHelper } from '../utils/FileHelper';
import { EnumImageType } from '../common/EnumImageType';

export class AdvertisingBannerService {
    public static async getAdvertisingBanners() {
        const files = await prisma.file.findMany({
            where: {
                deleteFlg: 0,
                objectType: EnumImageType.AdvertisingBanner
            },
            orderBy: { createdAt: 'desc' }
        });
        return files.map(FileHelper.mapToFileDto).filter(f => f !== null);
    }

    public static async getAdvertisingBannerById(id: number) {
        return prisma.file.findUnique({
            where: { fileId: BigInt(id) }
        });
    }

    public static async deleteAdvertisingBanner(id: number) {
        return prisma.file.update({
            where: { fileId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
