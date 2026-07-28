import { Request, Response } from 'express';
import { CompanyImageService } from '../services/CompanyImageService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class CompanyImageController {
    public static async getCompanyImages(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const results = await CompanyImageService.getCompanyImages(
                keyword as string,
                pSize,
                pPage
            );

            res.json(results);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getCompanyImageById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await CompanyImageService.getCompanyImageById(Number(id));
            if (!item) return res.status(404).json(new ErrorResponseDto(undefined, 'Not found'));
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createCompanyImage(req: Request, res: Response) {
        try {
            const item = await CompanyImageService.createCompanyImage(req.body);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateCompanyImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await CompanyImageService.updateCompanyImage(Number(id), req.body);
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteCompanyImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await CompanyImageService.deleteCompanyImage(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
