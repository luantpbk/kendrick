import { Request, Response } from 'express';
import { TrackingService } from '../services/TrackingService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class TrackingController {
    public static async track(req: Request, res: Response) {
        try {
            const result = await TrackingService.track(req.body);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
