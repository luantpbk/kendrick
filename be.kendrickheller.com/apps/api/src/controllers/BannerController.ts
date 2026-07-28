import { Request, Response } from 'express';
import { BannerService } from '../services/BannerService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class BannerController {
    public static async getBanners(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const results = await BannerService.getBanners(
                keyword as string,
                pSize,
                pPage
            );

            res.json(results);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getBannerById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await BannerService.getBannerById(Number(id));
            if (!item) return res.status(404).json(new ErrorResponseDto(undefined, 'Not found'));
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createBanner(req: Request, res: Response) {
        try {
            const item = await BannerService.createBanner(req.body);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateBanner(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await BannerService.updateBanner(Number(id), req.body);
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteBanner(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await BannerService.deleteBanner(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
