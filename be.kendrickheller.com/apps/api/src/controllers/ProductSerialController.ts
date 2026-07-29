import { Request, Response } from 'express';
import { prisma } from '@kendrickheller/core';
import { ProductSerialService } from '../services/ProductSerialService';

export class ProductSerialController {
    public static async getProductSerials(req: Request, res: Response) {
        try {
            const keyword = req.query.keyword as string;
            const size = req.query.size ? parseInt(req.query.size as string) : 20;
            const page = req.query.page ? parseInt(req.query.page as string) : 0;
            
            const result = await ProductSerialService.getProductSerials(keyword, size, page);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async getProductSerialsByProduct(req: Request, res: Response) {
        try {
            const productId = parseInt(req.params.id);
            const keyword = req.query.keyword as string;
            const size = req.query.size ? parseInt(req.query.size as string) : 20;
            const page = req.query.page ? parseInt(req.query.page as string) : 0;
            const status = req.query.status ? parseInt(req.query.status as string) : undefined;
            
            const result = await ProductSerialService.getProductSerials(keyword, size, page, productId, status);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async getProductSerial(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await ProductSerialService.getProductSerialById(id);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async createProductSerial(req: Request, res: Response) {
        try {
            const result = await ProductSerialService.createProductSerial(req.body);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async updateProductSerial(req: Request, res: Response) {
        try {
            const id = req.body.productSerialId ? parseInt(req.body.productSerialId) : 0;
            const result = await ProductSerialService.updateProductSerial(id, req.body);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async sellProductSerial(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await ProductSerialService.sellProductSerial(id);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async deleteProductSerial(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await ProductSerialService.deleteProductSerial(id);
            res.json(true);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async getMyProductSerials(req: Request, res: Response) {
        try {
            const keyword = req.query.keyword as string;
            const user = (req as any).user;
            const userId = user ? Number(user.userId) : 0;
            const result = await ProductSerialService.getMyProductSerials(userId, keyword);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async export(req: Request, res: Response) {
        try {
            const productId = parseInt(req.query.productId as string);
            if (!productId) return res.status(400).json({ errorMessage: 'Missing productId' });
            
            const buffer = await ProductSerialService.export(productId);
            const date = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
            const fileName = `DanhSachSerial_${date}.xlsx`;
            
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async exportTemplate(req: Request, res: Response) {
        try {
            const productId = parseInt(req.query.productId as string);
            if (!productId) return res.status(400).json({ errorMessage: 'Missing productId' });
            
            const buffer = await ProductSerialService.exportTemplate(productId);
            const date = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
            const fileName = `MauNhapSerial_${date}.xlsx`;
            
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async importExcel(req: Request, res: Response) {
        try {
            const productId = parseInt(req.query.productId as string);
            if (!productId) return res.status(400).json({ errorMessage: 'Missing productId' });
            
            const file = req.file;
            if (!file) return res.status(400).json({ errorMessage: 'No file uploaded' });
            
            await ProductSerialService.importExcel(file.buffer, productId);
            res.json(true);
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async uploadAvatar(req: Request, res: Response) {
        try {
            if (!req.file) return res.status(400).json({ errorMessage: 'No file uploaded' });
            res.json({ fileId: Date.now().toString(), fileName: req.file.filename, url: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${req.file.filename}` });
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
        }
    }

    public static async addImage(req: Request, res: Response) {
        try {
            if (!req.file) return res.status(400).json({ errorMessage: 'No file uploaded' });
            res.json({ fileId: Date.now().toString(), fileName: req.file.filename, url: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${req.file.filename}` });
        } catch (error: any) {
            res.status(500).json({ errorMessage: error.message });
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
            res.status(500).json({ errorMessage: error.message });
        }
    }
}
