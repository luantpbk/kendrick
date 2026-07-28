import { Request, Response } from 'express';
import { LogoService } from '../services/LogoService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class LogoController {
    public static async getLogos(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            const logos = await LogoService.getLogos(keyword as string, pSize, pPage);
            res.json(logos);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getFinalLogo(req: Request, res: Response) {
        try {
            const logo = await LogoService.getFinalLogo();
            if (!logo) return res.status(404).json(new ErrorResponseDto(undefined, 'Final logo not found'));
            res.json(logo);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getLogoById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const logo = await LogoService.getLogoById(Number(id));
            if (!logo) return res.status(404).json(new ErrorResponseDto(undefined, 'Logo not found'));
            res.json(logo);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createLogo(req: Request, res: Response) {
        try {
            const logo = await LogoService.createLogo(req.body);
            res.status(201).json(logo);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateLogo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const logo = await LogoService.updateLogo(Number(id), req.body);
            res.json(logo);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteLogo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await LogoService.deleteLogo(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
