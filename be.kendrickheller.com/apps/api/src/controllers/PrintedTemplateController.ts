import { Request, Response } from 'express';
import { PrintedTemplateService } from '../services/PrintedTemplateService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class PrintedTemplateController {
    public static async getPrintedTemplates(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const templates = await PrintedTemplateService.getPrintedTemplates(
                keyword as string,
                pSize,
                pPage
            );

            // Using replacer to handle BigInt
            res.send(JSON.stringify(templates, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getPrintedTemplateById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const template = await PrintedTemplateService.getPrintedTemplateById(BigInt(id));
            if (!template) {
                return res.status(404).json(new ErrorResponseDto(undefined, 'PrintedTemplate not found'));
            }
            res.send(JSON.stringify(template, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createPrintedTemplate(req: Request, res: Response) {
        try {
            const template = await PrintedTemplateService.createPrintedTemplate(req.body);
            res.status(201).send(JSON.stringify(template, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updatePrintedTemplate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const template = await PrintedTemplateService.updatePrintedTemplate(BigInt(id), req.body);
            res.send(JSON.stringify(template, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deletePrintedTemplate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await PrintedTemplateService.deletePrintedTemplate(BigInt(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
