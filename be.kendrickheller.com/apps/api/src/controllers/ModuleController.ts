import { Request, Response } from 'express';
import { ModuleService } from '../services/ModuleService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class ModuleController {
    public static async getModules(req: Request, res: Response) {
        try {
            const modules = await ModuleService.getModules();
            res.json(modules);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getModule(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const module = await ModuleService.getModule(Number(id));
            if (!module) return res.status(404).json(new ErrorResponseDto(undefined, 'Module not found'));
            res.json(module);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createModule(req: Request, res: Response) {
        try {
            const module = await ModuleService.createModule(req.body);
            res.status(201).json(module);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateModule(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const module = await ModuleService.updateModule(Number(id), req.body);
            res.json(module);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteModule(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ModuleService.deleteModule(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
