import { prisma, ErrorResponseDto } from '@kendrickheller/core';
import { FileHelper } from '../utils/FileHelper';
import { EnumImageType } from '../common/EnumImageType';

export class ProductRealmService {
    private static async attachRelatedData(realms: any[]) {
        if (!realms || realms.length === 0) return realms;
        
        const realmIds = realms.map(r => r.productRealmId);
        const files = await FileHelper.getFilesForObjects(EnumImageType.ProductRealmImage, realmIds);
        
        return realms.map(r => {
            const rId = Number(r.productRealmId);
            const realmFiles = files.filter(f => Number(f.objectId) === rId);
            
            const avatarFile = r.avatar ? realmFiles.find(f => f.fileId === Number(r.avatar)) : (realmFiles.length > 0 ? realmFiles[0] : null);

            return {
                ...r,
                productRealmId: Number(r.productRealmId),
                images: realmFiles,
                avatar: avatarFile ? avatarFile.fileUrl : null,
                thumbAvatar: avatarFile ? avatarFile.thumbUrl : null,
            };
        });
    }

    public static async getAllRealms(keyword?: string) {
        const data = await prisma.productRealm.findMany({
            where: {
                deleteFlg: 0,
                ...(keyword ? {
                    OR: [
                        { productRealmName: { contains: keyword, mode: 'insensitive' } },
                        { productRealmCode: { contains: keyword, mode: 'insensitive' } }
                    ]
                } : {})
            }
        });
        return this.attachRelatedData(data);
    }

    public static async getRealmById(id: number) {
        const data = await prisma.productRealm.findUnique({
            where: { productRealmId: id }
        });
        if (!data) return null;
        const formatted = await this.attachRelatedData([data]);
        return formatted[0];
    }

    public static async createRealm(data: any) {
        return prisma.productRealm.create({
            data: {
                ...data
            }
        });
    }

    public static async updateRealm(id: number, data: any) {
        return prisma.productRealm.update({
            where: { productRealmId: id },
            data: {
                ...data
            }
        });
    }

    public static async deleteRealm(id: number) {
        return prisma.productRealm.update({
            where: { productRealmId: id },
            data: { deleteFlg: 1 }
        });
    }
}
