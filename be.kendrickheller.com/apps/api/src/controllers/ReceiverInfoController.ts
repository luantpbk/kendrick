import { Request, Response } from 'express';
import { ReceiverInfoService } from '../services/ReceiverInfoService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class ReceiverInfoController {
    public static async getReceiverInfos(req: Request, res: Response) {
        try {
            const { keyword, size, page, userId } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            const pUserId = userId ? BigInt(userId as string) : undefined;
            
            const receiverInfos = await ReceiverInfoService.getReceiverInfos(
                keyword as string,
                pSize,
                pPage,
                pUserId
            );

            res.send(JSON.stringify(receiverInfos, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getReceiverInfoById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const receiverInfo = await ReceiverInfoService.getReceiverInfoById(BigInt(id));
            if (!receiverInfo) {
                return res.status(404).json(new ErrorResponseDto(undefined, 'ReceiverInfo not found'));
            }
            res.send(JSON.stringify(receiverInfo, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createReceiverInfo(req: Request, res: Response) {
        try {
            const receiverInfo = await ReceiverInfoService.createReceiverInfo(req.body);
            res.status(201).send(JSON.stringify(receiverInfo, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateReceiverInfo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const receiverInfo = await ReceiverInfoService.updateReceiverInfo(BigInt(id), req.body);
            res.send(JSON.stringify(receiverInfo, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteReceiverInfo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ReceiverInfoService.deleteReceiverInfo(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getMyReceiverInfos(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user || !user.userId) return res.status(401).json(new ErrorResponseDto(undefined, 'Unauthorized'));
            const result = await ReceiverInfoService.getReceiverInfos(undefined, 100, 0, user.userId);
            res.send(JSON.stringify(result.items, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getMyReceiverInfoById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await ReceiverInfoService.getReceiverInfoById(Number(id));
            res.send(JSON.stringify(item, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
