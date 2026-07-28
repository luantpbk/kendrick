import { Request, Response } from 'express';
import { CompanyInfoService } from '../services/CompanyInfoService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class CompanyInfoController {
    public static async getCompanyInfos(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const results = await CompanyInfoService.getCompanyInfos(
                keyword as string,
                pSize,
                pPage
            );

            res.json(results);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getCompanyInfoById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const companyInfo = await CompanyInfoService.getCompanyInfoById(Number(id));
            if (!companyInfo) return res.status(404).json(new ErrorResponseDto(undefined, 'CompanyInfo not found'));
            res.json(companyInfo);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getCompanyInfoByKey(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const companyInfo = await CompanyInfoService.getCompanyInfoByKey(key);
            if (!companyInfo) return res.status(404).json(new ErrorResponseDto(undefined, 'CompanyInfo not found'));
            res.json(companyInfo);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createCompanyInfo(req: Request, res: Response) {
        try {
            const item = await CompanyInfoService.createCompanyInfo(req.body);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateCompanyInfo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await CompanyInfoService.updateCompanyInfo(Number(id), req.body);
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteCompanyInfo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await CompanyInfoService.deleteCompanyInfo(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
