import { prisma } from '@kendrickheller/core';
import { AutoMapper } from '../utils/AutoMapper';
import { FileHelper } from '../utils/FileHelper';
import { EnumImageType } from '../common/EnumImageType';

export class ProductCategoryService {
    private static async attachRelatedData(categories: any[]) {
        if (!categories || categories.length === 0) return categories;
        
        const categoryIds = categories.map(c => c.productCategoryId);
        const realmIds = categories.map(c => c.productRealmId).filter(id => id != null);

        const [files, realms] = await Promise.all([
            FileHelper.getFilesForObjects(EnumImageType.ProductCategoryImage, categoryIds),
            prisma.productRealm.findMany({ where: { productRealmId: { in: realmIds } } })
        ]);
        
        return categories.map(c => {
            const cId = Number(c.productCategoryId);
            const categoryFiles = files.filter(f => Number(f.objectId) === cId);
            
            // J2EE uses ProductCategoryImage logic or similar to attach avatar.
            // Some might not have explicit `avatar` field on table, but use first image.
            const avatarFile = categoryFiles.length > 0 ? categoryFiles[0] : null;

            const realm = realms.find(r => Number(r.productRealmId) === Number(c.productRealmId));

            return {
                ...c,
                productCategoryId: Number(c.productCategoryId),
                productRealmId: c.productRealmId ? Number(c.productRealmId) : null,
                productRealm: realm ? { ...realm, productRealmId: Number(realm.productRealmId) } : null,
                images: categoryFiles,
                avatar: avatarFile ? avatarFile.fileUrl : null,
                thumbAvatar: avatarFile ? avatarFile.thumbUrl : null,
            };
        });
    }

    public static async getAllCategories(keyword?: string, realmId?: number) {
        const data = await prisma.productCategory.findMany({
            where: {
                deleteFlg: 0,
                ...(realmId ? { productRealmId: realmId } : {}),
                ...(keyword ? {
                    OR: [
                        { productCategoryName: { contains: keyword, mode: 'insensitive' } },
                        { productCategoryCode: { contains: keyword, mode: 'insensitive' } }
                    ]
                } : {})
            },
        });
        return this.attachRelatedData(data);
    }

    public static async getCategoryById(id: number) {
        const data = await prisma.productCategory.findUnique({
            where: { productCategoryId: id },
        });
        if (!data) return null;
        const formatted = await this.attachRelatedData([data]);
        return formatted[0];
    }

    public static async createCategory(data: any) {
        const sanitized = AutoMapper.mapToPrisma('ProductCategory', data, true);
        const result = await prisma.productCategory.create({
            data: sanitized
        });
        return this.getCategoryById(Number(result.productCategoryId));
    }

    public static async updateCategory(id: number, data: any) {
        const sanitized = AutoMapper.mapToPrisma('ProductCategory', data, false);
        await prisma.productCategory.update({
            where: { productCategoryId: id },
            data: sanitized
        });
        return this.getCategoryById(id);
    }

    public static async deleteCategory(id: number) {
        return prisma.productCategory.update({
            where: { productCategoryId: id },
            data: { deleteFlg: 1 }
        });
    }

    public static readonly ATTRIBUTES = [
        { attributeTitle: "Giá tiền 2", attributeName: "price2", attributeType: 19 },
        { attributeTitle: "Mô tả 1", attributeName: "description1", attributeType: 1 },
        { attributeTitle: "Mô tả 2", attributeName: "description2", attributeType: 1 },
        { attributeTitle: "Mô tả 3", attributeName: "description3", attributeType: 1 },
        { attributeTitle: "Mô tả 4", attributeName: "description4", attributeType: 1 },
        { attributeTitle: "HTML 1", attributeName: "html1", attributeType: 16 },
        { attributeTitle: "HTML 2", attributeName: "html2", attributeType: 16 },
        { attributeTitle: "Option 1", attributeName: "option1", attributeType: 15 },
        { attributeTitle: "Option 2", attributeName: "option2", attributeType: 15 },
        { attributeTitle: "Option 3", attributeName: "option3", attributeType: 15 }
    ];

    public static async getAttributes() {
        return this.ATTRIBUTES;
    }

    private static mapAttributes(attributes: any[]) {
        return attributes.map(attr => {
            const predefined = this.ATTRIBUTES.find(a => a.attributeName === attr.attributeName);
            return {
                ...attr,
                attribute: predefined ? predefined : null
            };
        });
    }

    public static async getCategoryDisplayOption(id: number) {
        const attributes = await prisma.productCategoryAttribute.findMany({
            where: { productCategoryId: id }
        });
        return this.mapAttributes(attributes);
    }

    public static async updateCategoryDisplayOption(id: number, listConfig: any[]) {
        await prisma.productCategoryAttribute.deleteMany({
            where: { productCategoryId: id }
        });
        if (listConfig && listConfig.length > 0) {
            const data = listConfig.map(config => ({
                productCategoryId: id,
                attributeTitle: config.attributeTitle,
                attributeName: config.attributeName,
                attributeType: config.attributeType,
                isShowProduct: config.isShowProduct,
                isShowProductSerial: config.isShowProductSerial,
                isShowProductSerialDetail: config.isShowProductSerialDetail,
                displayOrder: config.displayOrder
            }));
            await prisma.productCategoryAttribute.createMany({
                data
            });
        }
        return this.getCategoryDisplayOption(id);
    }

    public static async getCategoryAttributesByIds(ids: number[]) {
        const attributes = await prisma.productCategoryAttribute.findMany({
            where: { productCategoryId: { in: ids } }
        });
        const mappedAttributes = this.mapAttributes(attributes);
        const result: any = {};
        mappedAttributes.forEach(attr => {
            const id = Number(attr.productCategoryId);
            if (!result[id]) result[id] = [];
            result[id].push(attr);
        });
        return result;
    }
}
