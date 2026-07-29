import { Request, Response } from 'express';
import { NewsService } from '../services/NewsService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class NewsController {
    public static async getNews(req: Request, res: Response) {
        try {
            const { size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;

            const news = await NewsService.getNews(pSize, pPage);
            res.json(news);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getNewsById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await NewsService.getNewsById(Number(id));
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
            if (!req.file) return res.status(400).json(new ErrorResponseDto(undefined, 'No file uploaded'));
            res.json({ fileId: Date.now().toString(), fileName: req.file.filename, url: `${process.env.FILE_URL || 'https://rs.kendrickheller.com'}/${req.file.filename}` });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteImage(req: Request, res: Response) {
        try {
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createNews(req: Request, res: Response) {
        try {
            const news = await NewsService.createNews(req.body);
            res.status(201).json(news);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateNews(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const news = await NewsService.updateNews(Number(id), req.body);
            res.json(news);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteNews(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await NewsService.deleteNews(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getComments(req: Request, res: Response) {
        try {
            res.json([]);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getChildComments(req: Request, res: Response) {
        try {
            res.json([]);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createComment(req: Request, res: Response) {
        try {
            res.status(201).json(req.body);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
