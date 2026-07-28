import { Request, Response } from 'express';
import { AdvertisingBannerService } from '../services/AdvertisingBannerService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class AdvertisingBannerController {
    public static async getAdvertisingBanners(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const results = await AdvertisingBannerService.getAdvertisingBanners();

            res.json(results);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getAdvertisingBannerById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await AdvertisingBannerService.getAdvertisingBannerById(Number(id));
            if (!item) return res.status(404).json(new ErrorResponseDto(undefined, 'Not found'));
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteAdvertisingBanner(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await AdvertisingBannerService.deleteAdvertisingBanner(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
