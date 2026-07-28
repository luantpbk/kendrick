import { Request, Response } from 'express';
import { ApiService } from '../services/ApiService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class ApiController {
    public static async getApis(req: Request, res: Response) {
        try {
            const apis = await ApiService.getApis();
            res.json(apis);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getApi(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const api = await ApiService.getApi(Number(id));
            if (!api) return res.status(404).json(new ErrorResponseDto(undefined, 'Api not found'));
            res.json(api);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createApi(req: Request, res: Response) {
        try {
            const api = await ApiService.createApi(req.body);
            res.status(201).json(api);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateApi(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const api = await ApiService.updateApi(Number(id), req.body);
            res.json(api);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteApi(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ApiService.deleteApi(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getApiFunctions(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const functions = await ApiService.getApiFunctions(Number(id));
            res.json(functions);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async addApiFunction(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { functionId } = req.body;
            const apiFunction = await ApiService.addApiFunction(Number(id), Number(functionId));
            res.status(201).json(apiFunction);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteApiFunction(req: Request, res: Response) {
        try {
            const { id, functionId } = req.params;
            await ApiService.deleteApiFunction(Number(id), Number(functionId));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
