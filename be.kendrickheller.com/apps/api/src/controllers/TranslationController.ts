import { Request, Response } from 'express';
import { TranslationService } from '../services/TranslationService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class TranslationController {
    public static async getAll(req: Request, res: Response) {
        try {
            const { size, page } = req.query;
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;

            const items = await TranslationService.getAll(pSize, pPage);
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
            const item = await TranslationService.getById(Number(id));
            if (!item) return res.status(404).json(new ErrorResponseDto(undefined, 'Item not found'));
            
            const itemResponse = JSON.parse(JSON.stringify(item, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
            res.json(itemResponse);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async create(req: Request, res: Response) {
        try {
            const item = await TranslationService.create(req.body);
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
            const item = await TranslationService.update(Number(id), req.body);
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
            await TranslationService.delete(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async generate(req: Request, res: Response) {
        try {
            await TranslationService.generateI18nFile();
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async autoTranslate(req: Request, res: Response) {
        try {
            const { texts } = req.body;
            if (!Array.isArray(texts)) {
                return res.status(400).json(new ErrorResponseDto(undefined, 'texts must be an array of strings'));
            }
            const results = await TranslationService.autoTranslate(texts);
            
            const itemsResponse = JSON.parse(JSON.stringify(results, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
            res.json(itemsResponse);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
