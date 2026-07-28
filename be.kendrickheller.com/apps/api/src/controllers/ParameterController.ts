import { Request, Response } from 'express';
import { ParameterService } from '../services/ParameterService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class ParameterController {
    public static async getParameters(req: Request, res: Response) {
        try {
            const { size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;

            const parameters = await ParameterService.getParameters(pSize, pPage);
            res.json(parameters);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getParameterById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const parameter = await ParameterService.getParameterById(Number(id));
            if (!parameter) return res.status(404).json(new ErrorResponseDto(undefined, 'Parameter not found'));
            res.json(parameter);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createParameter(req: Request, res: Response) {
        try {
            const parameter = await ParameterService.createParameter(req.body);
            res.status(201).json(parameter);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateParameter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const parameter = await ParameterService.updateParameter(Number(id), req.body);
            res.json(parameter);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteParameter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ParameterService.deleteParameter(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
