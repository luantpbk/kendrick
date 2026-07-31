import { prisma } from '@kendrickheller/core';
import { EnumFileTypeMap } from '../common/EnumFileType';
import { EnumImageTypeMap } from '../common/EnumImageType';

const FILE_URL = process.env.FILE_URL || 'https://rs.kendrickheller.com';
const THUMB_FILE_FOLDER_NAME = 'thumb';

export class FileHelper {
    public static mapToFileDto(file: any) {
        if (!file || !file.systemName) return null;
        
        const fileTypeSubPath = EnumFileTypeMap[file.fileTypeId] || 'other';
        
        let fileUrl = '';
        let thumbUrl = '';

        if (file.fileTypeId === 1) {
            // Flatten image directory structure
            fileUrl = `${FILE_URL}/${fileTypeSubPath}/${file.systemName}`;
            thumbUrl = `${FILE_URL}/${fileTypeSubPath}/${THUMB_FILE_FOLDER_NAME}/${file.systemName}`;
        } else if (file.systemName.startsWith('file-')) {
            const localUrl = `${FILE_URL}/${file.systemName}`;
            fileUrl = localUrl;
            thumbUrl = localUrl;
        } else {
            const imageTypeSubPath = EnumImageTypeMap[file.objectType] || 'other';
            fileUrl = `${FILE_URL}/${fileTypeSubPath}/${imageTypeSubPath}/${file.systemName}`;
            thumbUrl = `${FILE_URL}/${fileTypeSubPath}/${imageTypeSubPath}/${THUMB_FILE_FOLDER_NAME}/${file.systemName}`;
        }
        
        return {
            ...file,
            fileId: Number(file.fileId),
            fileUrl,
            thumbUrl
        };
    }

    public static async getFilesForObject(objectType: number, objectId: number | bigint | string) {
        const files = await prisma.file.findMany({
            where: {
                objectType: objectType,
                objectId: BigInt(objectId),
                deleteFlg: 0
            }
        });
        return files.map(FileHelper.mapToFileDto).filter(f => f !== null);
    }

    public static async getFilesForObjects(objectType: number, objectIds: (number | bigint | string)[]) {
        if (!objectIds || objectIds.length === 0) return [];
        const files = await prisma.file.findMany({
            where: {
                objectType: objectType,
                objectId: { in: objectIds.map(id => BigInt(id)) },
                deleteFlg: 0
            }
        });
        return files.map(FileHelper.mapToFileDto).filter(f => f !== null);
    }
}
