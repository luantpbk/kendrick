import { prisma } from '@kendrickheller/core';
import { FileHelper } from '../utils/FileHelper';
import fs from 'fs';
import path from 'path';

export class FileService {
    private static scanImagesDir(dir: string, fileList: string[] = []) {
        if (!fs.existsSync(dir)) return fileList;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                if (file !== 'thumb') { // Exclude thumbnails
                    this.scanImagesDir(filePath, fileList);
                }
            } else {
                const ext = path.extname(file).toLowerCase();
                if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                    fileList.push(filePath);
                }
            }
        }
        return fileList;
    }

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
        
        // Scan physical files
        const physicalFiles = this.scanImagesDir(uploadsDir);
        
        const result = [];
        for (const physicalPath of physicalFiles) {
            const relativePath = path.relative(uploadsDir, physicalPath).replace(/\\/g, '/');
            const basename = path.basename(physicalPath);
            
            // Find in DB
            const dbFile = files.find(f => {
                if (f.systemName && f.systemName.startsWith('file-')) {
                    return f.systemName === relativePath;
                }
                return f.systemName === basename;
            });
            
            if (dbFile) {
                const dto = FileHelper.mapToFileDto(dbFile);
                if (dto) {
                    result.push({
                        ...dto,
                        url: dto.fileUrl
                    });
                }
            } else {
                // Not in DB, virtual File
                const fileUrl = `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${relativePath}`;
                result.push({
                    fileId: -1, 
                    fileTypeId: 1,
                    fileName: basename,
                    systemName: relativePath, 
                    fileUrl: fileUrl,
                    thumbUrl: fileUrl,
                    url: fileUrl
                });
            }
        }
        
        return result.sort((a, b) => b.fileId - a.fileId);
    }

    public static async registerExistingImage(systemName: string) {
        const basename = path.basename(systemName);
        let objectType = 8;
        const map: Record<string, number> = {
            'product_realm_image': 0,
            'product_category_image': 1,
            'product_image': 2,
            'product_serial_image': 3,
            'banner': 4,
            'company_image': 5,
            'logo': 6,
            'advertising_banner': 7,
            'other': 8
        };
        for (const [folder, type] of Object.entries(map)) {
            if (systemName.includes(`/${folder}/`) || systemName.includes(`\\${folder}\\`)) {
                objectType = type;
                break;
            }
        }
        
        // Ensure we don't duplicate if called multiple times concurrently
        let file = await prisma.file.findFirst({
            where: { systemName: basename, deleteFlg: 0 }
        });

        if (!file) {
            file = await prisma.file.create({
                data: {
                    fileName: basename,
                    systemName: basename,
                    fileTypeId: 1,
                    objectType: objectType,
                    objectId: null,
                    deleteFlg: 0
                }
            });
        }
        
        const dto = FileHelper.mapToFileDto(file);
        return {
            ...dto,
            url: dto?.fileUrl
        };
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

    public static async checkImageUsage(fileId: number) {
        const file = await prisma.file.findUnique({ where: { fileId: BigInt(fileId) } });
        if (!file || !file.systemName) return [];

        const usages: string[] = [];
        const systemName = file.systemName;

        // Check if attached directly to another entity
        const attachedFiles = await prisma.file.findMany({
            where: {
                systemName: systemName,
                fileId: { not: BigInt(fileId) },
                deleteFlg: 0
            }
        });
        if (attachedFiles.length > 0) {
            usages.push(`Đang được chọn làm ảnh đính kèm (có ${attachedFiles.length} bản sao đang được dùng)`);
        }

        // Check Product text fields
        const products = await prisma.product.findMany({
            where: {
                deleteFlg: 0,
                OR: [
                    { html1: { contains: systemName } },
                    { html2: { contains: systemName } },
                    { description1: { contains: systemName } },
                    { description2: { contains: systemName } },
                    { description3: { contains: systemName } },
                    { description4: { contains: systemName } },
                ]
            },
            select: { productName: true }
        });
        if (products.length > 0) {
            usages.push(`Sản phẩm: ${products.map(p => p.productName).join(', ')}`);
        }

        // Check News text fields
        const news = await prisma.news.findMany({
            where: {
                deleteFlg: 0,
                newValue: { contains: systemName }
            },
            select: { newTitle: true }
        });
        if (news.length > 0) {
            usages.push(`Tin tức: ${news.map(n => n.newTitle).join(', ')}`);
        }

        // Check StaticPage
        const pages = await prisma.staticPage.findMany({
            where: {
                deleteFlg: 0,
                OR: [
                    { vi: { contains: systemName } },
                    { en: { contains: systemName } }
                ]
            },
            select: { staticPageTitle: true }
        });
        if (pages.length > 0) {
            usages.push(`Trang tĩnh: ${pages.map(p => p.staticPageTitle).join(', ')}`);
        }

        // Check Translation
        const translations = await prisma.translation.findMany({
            where: {
                deleteFlg: 0,
                OR: [
                    { vi: { contains: systemName } },
                    { en: { contains: systemName } },
                    { fr: { contains: systemName } }
                ]
            },
            select: { code: true }
        });
        if (translations.length > 0) {
            usages.push(`Bản dịch: ${translations.map(t => t.code).join(', ')}`);
        }

        return usages;
    }

    public static async deleteImage(fileId: number, systemName?: string) {
        if (fileId === -1 && systemName) {
            const cleanSystemName = systemName.replace(/^(\.\.[\/\\])+/, '');
            if (cleanSystemName.includes('..')) return false;

            const uploadsDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
            const imgPath = path.join(uploadsDir, cleanSystemName);
            const thumbPath = path.join(uploadsDir, 'images', 'thumb', path.basename(cleanSystemName));

            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
            if (fs.existsSync(thumbPath)) {
                fs.unlinkSync(thumbPath);
            }
            return true;
        }

        const file = await prisma.file.findUnique({ where: { fileId: BigInt(fileId) } });
        if (!file) return false;

        // 1. Mark as deleted in DB
        await prisma.file.update({
            where: { fileId: BigInt(fileId) },
            data: { deleteFlg: 1 }
        });

        // 2. Delete physical files
        const uploadsDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
        if (file.systemName) {
            const imgPath = path.join(uploadsDir, 'images', file.systemName);
            const thumbPath = path.join(uploadsDir, 'images', 'thumb', file.systemName);

            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
            if (fs.existsSync(thumbPath)) {
                fs.unlinkSync(thumbPath);
            }
        }

        return true;
    }
}
