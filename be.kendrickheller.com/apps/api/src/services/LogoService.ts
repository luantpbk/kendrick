import { prisma } from '@kendrickheller/core';
import { FileHelper } from '../utils/FileHelper';

export class LogoService {
    public static async getLogos(keyword?: string, size: number = 20, page: number = 0) {
        const whereClause: any = {
            deleteFlg: 0,
            objectType: 6
        };

        if (keyword) {
            whereClause.fileName = { contains: keyword, mode: 'insensitive' };
        }

        const files = await prisma.file.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        return files.map(FileHelper.mapToFileDto).filter(f => f !== null);
    }
    
    public static async getFinalLogo() {
        const logo = await prisma.file.findFirst({
            where: { deleteFlg: 0, objectType: 6 },
            orderBy: { createdAt: 'desc' }
        });
        return logo ? FileHelper.mapToFileDto(logo) : null;
    }

    public static async getLogoById(id: number) {
        return prisma.file.findUnique({
            where: { fileId: BigInt(id) }
        });
    }

    public static async createLogo(data: any) {
        return prisma.file.create({
            data: { ...data, objectType: 6 }
        });
    }

    public static async updateLogo(id: number, data: any) {
        return prisma.file.update({
            where: { fileId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async deleteLogo(id: number) {
        return prisma.file.update({
            where: { fileId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
