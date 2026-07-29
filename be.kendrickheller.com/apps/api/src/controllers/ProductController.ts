import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { ErrorResponseDto, prisma } from '@kendrickheller/core';

export class ProductController {
    public static async getProducts(req: Request, res: Response) {
        try {
            const { keyword, size, page, realmIds, categoryIds, stopSelling, hot, sortField, sortOrder } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const rIds = realmIds ? (realmIds as string).split(',').map(Number) : undefined;
            const cIds = categoryIds ? (categoryIds as string).split(',').map(Number) : undefined;
            
            const pStopSelling = stopSelling !== undefined ? stopSelling === 'true' : undefined;
            const pHot = hot !== undefined ? hot === 'true' : undefined;

            const pSortField = (sortField as string) || 'displayOrder';
            const pSortOrder = (sortOrder as 'asc' | 'desc') || 'asc';

            const products = await ProductService.getProducts(
                keyword as string,
                pSize,
                pPage,
                rIds,
                cIds,
                pStopSelling,
                pHot,
                pSortField,
                pSortOrder
            );

            res.json(products);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getProductsByIds(req: Request, res: Response) {
        try {
            let ids = req.body;
            
            if (ids && typeof ids === 'object' && !Array.isArray(ids)) {
                if (ids.ids && Array.isArray(ids.ids)) {
                    ids = ids.ids;
                } else if (ids.data && Array.isArray(ids.data)) {
                    ids = ids.data;
                } else {
                    ids = Object.values(ids);
                }
            }

            if (typeof ids === 'string') {
                try { ids = JSON.parse(ids); } catch(e) {}
            }

            if (!Array.isArray(ids)) {
                return res.status(400).json(new ErrorResponseDto(undefined, `Expected an array of ids. Received: ${JSON.stringify(req.body)}`));
            }

            const numericIds = ids.map(Number).filter((n: number) => !isNaN(n));
            const products = await ProductService.getProductsByIds(numericIds);
            res.json(products);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(Number(id));
            if (!product) return res.status(404).json(new ErrorResponseDto(undefined, 'Product not found'));
            res.json(product);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createProduct(req: Request, res: Response) {
        try {
            const product = await ProductService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await ProductService.updateProduct(Number(id), req.body);
            res.json(product);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ProductService.deleteProduct(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async uploadAvatar(req: Request, res: Response) {
        try {
            if (!req.file) return res.status(400).json(new ErrorResponseDto(undefined, 'No file uploaded'));
            
            const productId = req.params.id ? Number(req.params.id) : 0;
            const file = await prisma.file.create({
                data: {
                    fileName: req.file.originalname,
                    systemName: req.file.filename,
                    fileTypeId: 1,
                    objectType: 2,
                    objectId: productId,
                    deleteFlg: 0
                }
            });

            if (productId > 0) {
                await prisma.product.update({
                    where: { productId },
                    data: { avatar: BigInt(file.fileId) }
                });
            }

            res.json({ 
                fileId: Number(file.fileId), 
                fileName: file.fileName, 
                fileUrl: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${file.systemName}`,
                thumbUrl: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${file.systemName}`,
                url: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${file.systemName}` 
            });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async addImage(req: Request, res: Response) {
        try {
            if (!req.file) return res.status(400).json(new ErrorResponseDto(undefined, 'No file uploaded'));
            
            const file = await prisma.file.create({
                data: {
                    fileName: req.file.originalname,
                    systemName: req.file.filename,
                    fileTypeId: 1,
                    objectType: 2,
                    objectId: req.params.id ? Number(req.params.id) : 0,
                    deleteFlg: 0
                }
            });

            res.json({ 
                fileId: Number(file.fileId), 
                fileName: file.fileName, 
                fileUrl: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${file.systemName}`,
                thumbUrl: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${file.systemName}`,
                url: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${file.systemName}` 
            });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async addImageFromLibrary(req: Request, res: Response) {
        try {
            const productId = req.params.id ? Number(req.params.id) : 0;
            const { fileId } = req.body;
            
            const existingFile = await prisma.file.findUnique({ where: { fileId: BigInt(fileId) } });
            if (!existingFile) return res.status(404).json(new ErrorResponseDto(undefined, "File not found"));

            const newFile = await prisma.file.create({
                data: {
                    fileName: existingFile.fileName,
                    systemName: existingFile.systemName,
                    fileTypeId: 1,
                    objectType: 2,
                    objectId: productId,
                    deleteFlg: 0
                }
            });

            res.json({ 
                fileId: Number(newFile.fileId), 
                fileName: newFile.fileName, 
                fileUrl: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${newFile.systemName}`,
                thumbUrl: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${newFile.systemName}`,
                url: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${newFile.systemName}` 
            });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteImage(req: Request, res: Response) {
        try {
            const fileId = req.params.fileId;
            if (fileId) {
                await prisma.file.update({
                    where: { fileId: BigInt(fileId) },
                    data: { deleteFlg: 1 }
                });
            }
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
