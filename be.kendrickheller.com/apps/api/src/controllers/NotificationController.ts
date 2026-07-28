import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class NotificationController {
    public static async getNotifications(req: Request, res: Response) {
        try {
            const { size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;

            const notifications = await NotificationService.getNotifications(pSize, pPage);
            res.json(notifications);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getNotificationById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const notification = await NotificationService.getNotificationById(Number(id));
            if (!notification) return res.status(404).json(new ErrorResponseDto(undefined, 'Notification not found'));
            res.json(notification);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createNotification(req: Request, res: Response) {
        try {
            const notification = await NotificationService.createNotification(req.body);
            res.status(201).json(notification);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateNotification(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const notification = await NotificationService.updateNotification(Number(id), req.body);
            res.json(notification);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteNotification(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await NotificationService.deleteNotification(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getBadge(req: Request, res: Response) {
        try {
            res.json({ count: 0 });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getMyNotifications(req: Request, res: Response) {
        try {
            res.json({ count: 0, items: [] });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async markSeen(req: Request, res: Response) {
        try {
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async markReadAll(req: Request, res: Response) {
        try {
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async markRead(req: Request, res: Response) {
        try {
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
