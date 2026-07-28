import { prisma } from '@kendrickheller/core';
import { FileHelper } from '../utils/FileHelper';
import { EnumImageType } from '../common/EnumImageType';

export class ProductService {
    private static async attachRelatedData(products: any[]) {
        if (!products || products.length === 0) return products;

        const productIds = products.map(p => p.productId);

        const productCategoryIds = products.map(p => p.productCategoryId).filter(id => id != null);

        const [files, gifts, serials, categories] = await Promise.all([
            FileHelper.getFilesForObjects(EnumImageType.ProductImage, productIds),
            prisma.productGift.findMany({ where: { productId: { in: productIds } } }),
            prisma.productSerial.findMany({ where: { productId: { in: productIds } } }),
            prisma.productCategory.findMany({ where: { productCategoryId: { in: productCategoryIds } } })
        ]);

        return products.map(p => {
            const pId = Number(p.productId);
            const productFiles = files.filter(f => Number(f.objectId) === pId);
            const productGifts = gifts.filter(g => Number(g.productId) === pId);
            const productSerials = serials.filter(s => Number(s.productId) === pId);
            const category = categories.find(c => Number(c.productCategoryId) === Number(p.productCategoryId));

            const avatarFile = p.avatar ? productFiles.find(f => f.fileId === Number(p.avatar)) : null;

            return {
                ...p,
                productCategoryName: category ? category.productCategoryName : null,
                productId: Number(p.productId),
                productCategoryId: p.productCategoryId ? Number(p.productCategoryId) : null,
                avatarId: p.avatar ? Number(p.avatar) : null,
                avatar: avatarFile ? avatarFile.fileUrl : null,
                thumbAvatar: avatarFile ? avatarFile.thumbUrl : null,
                images: productFiles,
                productGifts: productGifts.map(g => ({ ...g, productGiftId: Number(g.productGiftId), productId: Number(g.productId) })),
                productSerials: productSerials.map(s => ({ ...s, productSerialId: Number(s.productSerialId), productId: Number(s.productId) }))
            };
        });
    }

    public static async getProducts(
        keyword?: string,
        size: number = 20,
        page: number = 0,
        realmIds?: number[],
        categoryIds?: number[],
        stopSelling?: boolean,
        hot?: boolean,
        sortField: string = 'displayOrder',
        sortOrder: 'asc' | 'desc' = 'asc'
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { productName: { contains: keyword, mode: 'insensitive' } },
                { productCode: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        if (realmIds && realmIds.length > 0) {
            whereClause.productCategory = {
                productRealmId: { in: realmIds }
            };
        }

        if (categoryIds && categoryIds.length > 0) {
            whereClause.productCategoryId = { in: categoryIds };
        }

        if (stopSelling !== undefined) {
            whereClause.stopSelling = stopSelling;
        }

        if (hot !== undefined) {
            whereClause.hot = hot;
        }

        const orderByClause: any = {};
        if (sortField) {
            orderByClause[sortField] = sortOrder;
        } else {
            orderByClause.createdAt = 'desc';
        }

        const [total, data] = await Promise.all([
            prisma.product.count({ where: whereClause }),
            prisma.product.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: orderByClause
            })
        ]);

        const formattedData = await this.attachRelatedData(data);

        return {
            count: total,
            items: formattedData,
            page,
            size
        };
    }

    public static async getProductsByIds(ids: number[]) {
        const data = await prisma.product.findMany({
            where: {
                productId: { in: ids },
                deleteFlg: 0
            }
        });
        return this.attachRelatedData(data);
    }

    public static async getProductById(id: number) {
        const data = await prisma.product.findUnique({
            where: { productId: id }
        });
        if (!data) return null;
        const formatted = await this.attachRelatedData([data]);
        return formatted[0];
    }

    public static async createProduct(data: any) {
        return prisma.product.create({
            data: { ...data }
        });
    }

    public static async updateProduct(id: number, data: any) {
        return prisma.product.update({
            where: { productId: id },
            data: { ...data }
        });
    }

    public static async deleteProduct(id: number) {
        return prisma.product.update({
            where: { productId: id },
            data: { deleteFlg: 1 }
        });
    }
}
