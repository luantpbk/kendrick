import { Request, Response } from 'express';
import { NotificationTemplateService } from '../services/NotificationTemplateService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class NotificationTemplateController {
    public static async getNotificationTemplates(req: Request, res: Response) {
        try {
            const { size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;

            const notificationTemplates = await NotificationTemplateService.getNotificationTemplates(pSize, pPage);
            res.json(notificationTemplates);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getNotificationTemplateById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const notificationTemplate = await NotificationTemplateService.getNotificationTemplateById(Number(id));
            if (!notificationTemplate) return res.status(404).json(new ErrorResponseDto(undefined, 'NotificationTemplate not found'));
            res.json(notificationTemplate);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createNotificationTemplate(req: Request, res: Response) {
        try {
            const notificationTemplate = await NotificationTemplateService.createNotificationTemplate(req.body);
            res.status(201).json(notificationTemplate);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateNotificationTemplate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const notificationTemplate = await NotificationTemplateService.updateNotificationTemplate(Number(id), req.body);
            res.json(notificationTemplate);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteNotificationTemplate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await NotificationTemplateService.deleteNotificationTemplate(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
