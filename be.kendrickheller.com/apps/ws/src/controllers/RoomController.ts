import { Request, Response } from 'express';
import { RoomService } from '../services/RoomService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class RoomController {
    public static async getRooms(req: any, res: Response) {
        try {
            const userId = req.user.userId;
            const size = parseInt(req.query.size as string) || 10;
            const page = parseInt(req.query.page as string) || 1;
            const result = await RoomService.getRooms(userId, size, page);
            res.json(result);
        } catch (e: any) {
            res.status(500).json(new ErrorResponseDto(undefined, e.message));
        }
    }

    public static async getBadge(req: any, res: Response) {
        try {
            const userId = req.user.userId;
            const badge = await RoomService.getBadge(userId);
            res.json(badge);
        } catch (e: any) {
            res.status(500).json(new ErrorResponseDto(undefined, e.message));
        }
    }

    public static async seenRooms(req: any, res: Response) {
        try {
            const userId = req.user.userId;
            const count = await RoomService.seenRooms(userId);
            res.json(count);
        } catch (e: any) {
            res.status(500).json(new ErrorResponseDto(undefined, e.message));
        }
    }

    public static async getRoomByUser(req: any, res: Response) {
        try {
            const userId = req.user.userId;
            const targetId = parseInt(req.params.id);
            const room = await RoomService.getRoomByUser(userId, targetId);
            res.json(room);
        } catch (e: any) {
            res.status(500).json(new ErrorResponseDto(undefined, e.message));
        }
    }

    public static async getRoomById(req: any, res: Response) {
        try {
            const roomId = req.params.id;
            const room = await RoomService.getRoomById(roomId);
            res.json(room);
        } catch (e: any) {
            res.status(500).json(new ErrorResponseDto(undefined, e.message));
        }
    }
}
