import { Request, Response } from 'express';
import { CommonInformationService } from '../services/CommonInformationService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class CommonInformationController {
    public static async getShipInfo(req: Request, res: Response) {
        try {
            const { zipcode } = req.query;
            const result = await CommonInformationService.getShipInfo(zipcode as string);
            res.json(result);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getExchangeRate(req: Request, res: Response) {
        try {
            const result = await CommonInformationService.getExchangeRate();
            res.json(result);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
