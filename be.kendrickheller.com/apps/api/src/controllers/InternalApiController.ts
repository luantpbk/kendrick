import { Request, Response } from 'express';
import { InternalApiService } from '../services/InternalApiService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class InternalApiController {
    public static async getApi(req: Request, res: Response) {
        try {
            const { router, methodId } = req.body;
            const api = await InternalApiService.getApi(router as string, Number(methodId));
            if (!api) return res.status(404).json(new ErrorResponseDto(undefined, 'Api not found'));
            res.json(api);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getFunctions(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const functions = await InternalApiService.getFunctions(Number(id));
            res.json(functions);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
