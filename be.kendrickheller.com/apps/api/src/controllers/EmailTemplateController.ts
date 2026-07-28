import { Request, Response } from 'express';
import { EmailTemplateService } from '../services/EmailTemplateService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class EmailTemplateController {
    public static async getEmailTemplates(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const emailTemplates = await EmailTemplateService.getEmailTemplates(
                keyword as string,
                pSize,
                pPage
            );

            res.json(emailTemplates);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getEmailTemplateById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const emailTemplate = await EmailTemplateService.getEmailTemplateById(Number(id));
            if (!emailTemplate) return res.status(404).json(new ErrorResponseDto(undefined, 'Email Template not found'));
            res.json(emailTemplate);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createEmailTemplate(req: Request, res: Response) {
        try {
            const emailTemplate = await EmailTemplateService.createEmailTemplate(req.body);
            res.status(201).json(emailTemplate);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateEmailTemplate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const emailTemplate = await EmailTemplateService.updateEmailTemplate(Number(id), req.body);
            res.json(emailTemplate);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteEmailTemplate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await EmailTemplateService.deleteEmailTemplate(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
