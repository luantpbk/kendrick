import { Request, Response } from 'express';
import { MessageService } from '../services/MessageService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class MessageController {
    public static async getMessages(req: Request, res: Response) {
        try {
            const roomId = req.params.id;
            const size = parseInt(req.query.size as string) || 20;
            const page = parseInt(req.query.page as string) || 1;
            
            const result = await MessageService.getMessages(roomId, size, page);
            res.json(result);
        } catch (e: any) {
            res.status(500).json(new ErrorResponseDto(undefined, e.message));
        }
    }

    public static async getLastestMessages(req: Request, res: Response) {
        try {
            const roomIds: string[] = req.body;
            if (!Array.isArray(roomIds)) {
                return res.status(400).json(new ErrorResponseDto(undefined, 'Body must be array of strings'));
            }
            const result = await MessageService.getLastestMessages(roomIds);
            res.json(result);
        } catch (e: any) {
            res.status(500).json(new ErrorResponseDto(undefined, e.message));
        }
    }
    
    public static async importImage(req: Request, res: Response) {
        // Assume multer is used in route
        try {
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return res.status(400).json(new ErrorResponseDto(undefined, 'No images uploaded'));
            }
            const fileUrls = files.map(f => `/uploads/images/${f.filename}`);
            res.json(fileUrls);
        } catch (e: any) {
            res.status(500).json(new ErrorResponseDto(undefined, e.message));
        }
    }
}
