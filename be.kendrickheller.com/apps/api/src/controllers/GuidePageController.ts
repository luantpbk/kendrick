import { Request, Response } from 'express';
import { GuidePageService } from '../services/GuidePageService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class GuidePageController {
    public static async getGuidePages(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const guidePages = await GuidePageService.getGuidePages(
                keyword as string,
                pSize,
                pPage
            );

            res.json(guidePages);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getGuidePageById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const guidePage = await GuidePageService.getGuidePageById(Number(id));
            if (!guidePage) return res.status(404).json(new ErrorResponseDto(undefined, 'Guide Page not found'));
            res.json(guidePage);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createGuidePage(req: Request, res: Response) {
        try {
            const guidePage = await GuidePageService.createGuidePage(req.body);
            res.status(201).json(guidePage);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateGuidePage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const guidePage = await GuidePageService.updateGuidePage(Number(id), req.body);
            res.json(guidePage);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteGuidePage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await GuidePageService.deleteGuidePage(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
