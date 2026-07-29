import { prisma } from '@kendrickheller/core';
import { FileHelper } from '../utils/FileHelper';

export class FileService {
    public static async getImages() {
        const files = await prisma.file.findMany({
            where: {
                fileTypeId: 1,
                objectType: { in: [8, null] },
                deleteFlg: 0
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        return files.map(file => {
            const dto = FileHelper.mapToFileDto(file);
            return {
                ...dto,
                url: dto?.fileUrl
            };
        }).filter(f => f !== null);
    }

    public static async uploadImage(fileData: any) {
        const file = await prisma.file.create({
            data: {
                fileName: fileData.originalname,
                systemName: fileData.filename,
                fileTypeId: 1, // Image
                objectType: 8, // EnumImageType.Other
                objectId: null,
                deleteFlg: 0
            }
        });
        
        const dto = FileHelper.mapToFileDto(file);
        return {
            ...dto,
            url: dto?.fileUrl
        };
    }
}
