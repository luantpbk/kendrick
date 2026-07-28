import { prisma } from '@kendrickheller/core';
import { FileHelper } from '../utils/FileHelper';
import { EnumImageType } from '../common/EnumImageType';
import exceljs from 'exceljs';

export class ProductSerialService {
    private static async attachRelatedData(serials: any[]) {
        if (!serials || serials.length === 0) return serials;

        const serialIds = serials.map(s => s.productSerialId);
        const productIds = serials.map(s => s.productId).filter(id => id != null);

        const [files, products] = await Promise.all([
            FileHelper.getFilesForObjects(EnumImageType.ProductSerialImage, serialIds),
            prisma.product.findMany({ where: { productId: { in: productIds } } })
        ]);

        return serials.map(s => {
            const sId = Number(s.productSerialId);
            const serialFiles = files.filter(f => Number(f.objectId) === sId);
            const avatarFile = s.avatar ? serialFiles.find(f => f.fileId === Number(s.avatar)) : null;
            const product = products.find(p => p.productId === s.productId);

            return {
                ...s,
                productSerialId: sId,
                productId: s.productId ? Number(s.productId) : null,
                productCode: product ? product.productCode : null,
                avatarId: s.avatar ? Number(s.avatar) : null,
                avatar: avatarFile ? avatarFile.fileUrl : null,
                thumbAvatar: avatarFile ? avatarFile.thumbUrl : null,
                images: serialFiles
            };
        });
    }

    public static async getProductSerials(
        keyword?: string,
        size: number = 20,
        page: number = 0,
        productId?: number,
        status?: number
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { serial: { contains: keyword, mode: 'insensitive' } },
                { phoneNumber: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        if (productId) {
            whereClause.productId = productId;
        }

        if (status !== undefined) {
            whereClause.status = status;
        }

        const [total, data] = await Promise.all([
            prisma.productSerial.count({ where: whereClause }),
            prisma.productSerial.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
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

    public static async getProductSerialById(id: number) {
        const data = await prisma.productSerial.findUnique({
            where: { productSerialId: BigInt(id) }
        });
        if (!data) return null;
        const formatted = await this.attachRelatedData([data]);
        return formatted[0];
    }

    public static async createProductSerial(data: any) {
        return prisma.productSerial.create({
            data: { ...data }
        });
    }

    public static async updateProductSerial(id: number, data: any) {
        return prisma.productSerial.update({
            where: { productSerialId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async sellProductSerial(id: number) {
        // Equivalent to sellProductSerial in logic
        return prisma.productSerial.update({
            where: { productSerialId: BigInt(id) },
            data: { status: 1 } // Example status for sold, might need mapping
        });
    }

    public static async deleteProductSerial(id: number) {
        return prisma.productSerial.update({
            where: { productSerialId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }

    public static async getMyProductSerials(userId: number, keyword?: string) {
        // Typically joins with ProductSerialUser
        const whereClause: any = {
            deleteFlg: 0
        };
        // Add user filter logic here when ProductSerialUser is available
        const data = await prisma.productSerial.findMany({
            where: whereClause
        });
        return this.attachRelatedData(data);
    }

    public static async export(productId: number) {
        const product = await prisma.product.findUnique({
            where: { productId: productId }
        });
        if (!product || !product.productCategoryId) throw new Error('Product not found or has no category');

        const categoryAttributes = await prisma.productCategoryAttribute.findMany({
            where: { productCategoryId: product.productCategoryId }
        });

        const productSerials = await prisma.productSerial.findMany({
            where: { productId: productId, deleteFlg: 0 }
        });

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet(product.productName || 'Sheet 1');

        const columns = [
            { header: 'STT', key: 'stt', width: 10 },
            { header: 'Serial', key: 'serial', width: 30 },
            { header: 'Trạng thái', key: 'status', width: 20 }
        ];

        for (const attr of categoryAttributes) {
            columns.push({ header: attr.attributeName || '', key: attr.attributeName || '', width: 25 });
        }

        worksheet.columns = columns;

        let rowIndex = 1;
        for (const serial of productSerials) {
            const rowData: any = {
                stt: rowIndex++,
                serial: serial.serial,
                status: serial.status === 1 ? 'Đã bán' : 'Tồn kho'
            };
            for (const attr of categoryAttributes) {
                if (attr.attributeName) {
                    rowData[attr.attributeName] = (serial as any)[attr.attributeName];
                }
            }
            worksheet.addRow(rowData);
        }

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    public static async exportTemplate(productId: number) {
        const product = await prisma.product.findUnique({
            where: { productId: productId }
        });
        if (!product || !product.productCategoryId) throw new Error('Product not found or has no category');

        const categoryAttributes = await prisma.productCategoryAttribute.findMany({
            where: { productCategoryId: product.productCategoryId }
        });

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet(product.productName || 'Sheet 1');

        const columns = [
            { header: 'STT', key: 'stt', width: 10 },
            { header: 'Serial', key: 'serial', width: 30 },
            { header: 'Trạng thái', key: 'status', width: 20 }
        ];

        for (const attr of categoryAttributes) {
            columns.push({ header: attr.attributeName || '', key: attr.attributeName || '', width: 25 });
        }

        worksheet.columns = columns;

        // Add dummy row for template
        const rowData: any = {
            stt: 1,
            serial: '<Nhập Serial>',
            status: '<Đã bán/Tồn kho>'
        };
        for (const attr of categoryAttributes) {
            if (attr.attributeName) {
                rowData[attr.attributeName] = '<Nhập giá trị>';
            }
        }
        worksheet.addRow(rowData);

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    public static async importExcel(fileBuffer: Buffer, productId: number) {
        const product = await prisma.product.findUnique({
            where: { productId: productId }
        });
        if (!product || !product.productCategoryId) throw new Error('Product not found or has no category');

        const categoryAttributes = await prisma.productCategoryAttribute.findMany({
            where: { productCategoryId: product.productCategoryId }
        });

        const workbook = new exceljs.Workbook();
        await workbook.xlsx.load(fileBuffer as any);
        const worksheet = workbook.worksheets[0];

        const serialsToCreate: any[] = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            
            const serialValue = row.getCell(2).value?.toString();
            const statusValue = row.getCell(3).value?.toString();
            
            if (!serialValue || serialValue === '<Nhập Serial>') return;

            const status = statusValue === 'Đã bán' ? 1 : 0;
            const newSerial: any = {
                productId: productId,
                serial: serialValue,
                status: status,
                deleteFlg: 0
            };

            let colIndex = 4;
            for (const attr of categoryAttributes) {
                if (attr.attributeName) {
                    newSerial[attr.attributeName] = row.getCell(colIndex++).value?.toString() || '';
                }
            }

            serialsToCreate.push(newSerial);
        });

        for (const s of serialsToCreate) {
            await prisma.productSerial.create({ data: s });
        }

        return true;
    }
}
