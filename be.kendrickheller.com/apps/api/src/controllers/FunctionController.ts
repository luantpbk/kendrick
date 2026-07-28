import { Request, Response } from 'express';
import { FunctionService } from '../services/FunctionService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class FunctionController {
    public static async getFunctions(req: Request, res: Response) {
        try {
            const { moduleId } = req.query;
            const functions = await FunctionService.getFunctions(Number(moduleId));
            res.json(functions);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getFunction(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const func = await FunctionService.getFunction(Number(id));
            if (!func) return res.status(404).json(new ErrorResponseDto(undefined, 'Function not found'));
            res.json(func);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createFunction(req: Request, res: Response) {
        try {
            const func = await FunctionService.createFunction(req.body);
            res.status(201).json(func);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateFunction(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const func = await FunctionService.updateFunction(Number(id), req.body);
            res.json(func);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteFunction(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await FunctionService.deleteFunction(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
