import { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class ServiceController {
    public static async getAll(req: Request, res: Response) {
        try {
            const { size, page } = req.query;
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;

            const items = await ServiceService.getAll(pSize, pPage);
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
            const item = await ServiceService.getById(Number(id));
            if (!item) return res.status(404).json(new ErrorResponseDto(undefined, 'Item not found'));
            
            // Convert BigInts to string for JSON serialization
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
            const item = await ServiceService.create(req.body);
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
            const item = await ServiceService.update(Number(id), req.body);
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
            await ServiceService.delete(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
