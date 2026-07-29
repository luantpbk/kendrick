import { prisma } from '@kendrickheller/core';
import { FileHelper } from '../utils/FileHelper';
import fs from 'fs';
import path from 'path';

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

        const uploadsDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

        return files.map(file => {
            const dto = FileHelper.mapToFileDto(file);
            return {
                ...dto,
                url: dto?.fileUrl
            };
        }).filter(f => {
            if (!f) return false;
            
            // Check if file exists on disk
            let localPath = '';
            if (f.systemName && f.systemName.startsWith('file-')) {
                localPath = path.join(uploadsDir, f.systemName);
            } else if (f.fileUrl) {
                try {
                    const urlParts = new URL(f.fileUrl);
                    localPath = path.join(uploadsDir, urlParts.pathname);
                } catch (e) {
                    return false;
                }
            }
            
            return localPath && fs.existsSync(localPath);
        });
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
