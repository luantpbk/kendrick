import { Request, Response } from 'express';
import { StaticPageService } from '../services/StaticPageService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class StaticPageController {
    public static async getAll(req: Request, res: Response) {
        try {
            const items = await StaticPageService.getAll();
            const itemsResponse = JSON.parse(JSON.stringify(items, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
            res.json(itemsResponse);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await StaticPageService.getById(Number(id));
            if (!item) return res.status(404).json(new ErrorResponseDto(undefined, 'Item not found'));
            
            const itemResponse = JSON.parse(JSON.stringify(item, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
            res.json(itemResponse);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getByKey(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const item = await StaticPageService.getByKey(key);
            if (!item) return res.status(404).json(new ErrorResponseDto(undefined, 'Item not found'));
            
            const itemResponse = JSON.parse(JSON.stringify(item, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
            res.json(itemResponse);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async uploadImage(req: Request, res: Response) {
        try {
            // Assume file is saved by multer middleware
            if (!req.file) return res.status(400).json(new ErrorResponseDto(undefined, 'No file uploaded'));
            // Return a dummy image response for now
            res.json({ fileId: Date.now().toString(), fileName: req.file.filename, url: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${req.file.filename}` });
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

    public static async create(req: Request, res: Response) {
        try {
            const item = await StaticPageService.create(req.body);
            const itemResponse = JSON.parse(JSON.stringify(item, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
            res.status(201).json(itemResponse);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await StaticPageService.update(Number(id), req.body);
            const itemResponse = JSON.parse(JSON.stringify(item, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
            res.json(itemResponse);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await StaticPageService.delete(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
