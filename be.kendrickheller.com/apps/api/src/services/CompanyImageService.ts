import { prisma } from '@kendrickheller/core';
import { FileHelper } from '../utils/FileHelper';

export class CompanyImageService {
    public static async getCompanyImages(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0,
            objectType: 5
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

    public static async getCompanyImageById(id: number) {
        return prisma.file.findUnique({
            where: { fileId: BigInt(id) }
        });
    }

    public static async createCompanyImage(data: any) {
        return prisma.file.create({
            data: { ...data, objectType: 5 }
        });
    }

    public static async updateCompanyImage(id: number, data: any) {
        return prisma.file.update({
            where: { fileId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async deleteCompanyImage(id: number) {
        return prisma.file.update({
            where: { fileId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
