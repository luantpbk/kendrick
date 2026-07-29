import { prisma } from '@puganigravio/core';

export class FileService {
    public static async getImages() {
        const files = await prisma.file.findMany({
            where: {
                fileTypeId: 1,
                deleteFlg: 0
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        return files.map(file => {
            const url = process.env.FILE_URL + '/' + file.systemName;
            return {
                fileId: file.fileId ? Number(file.fileId) : 0,
                fileTypeId: file.fileTypeId,
                fileName: file.fileName || '',
                fileUrl: url,
                thumbUrl: url,
                url: url
            };
        });
    }

    public static async uploadImage(fileData: any) {
        const file = await prisma.file.create({
            data: {
                fileName: fileData.originalname,
                systemName: fileData.filename,
                fileTypeId: 1, // Image
                objectType: null, // Generic image
                objectId: null,
                deleteFlg: 0
            }
        });
        
        const url = process.env.FILE_URL + '/' + file.systemName;
        return {
            fileId: file.fileId ? Number(file.fileId) : 0,
            fileTypeId: file.fileTypeId,
            fileName: file.fileName || '',
            fileUrl: url,
            thumbUrl: url,
            url: url
        };
    }
}
