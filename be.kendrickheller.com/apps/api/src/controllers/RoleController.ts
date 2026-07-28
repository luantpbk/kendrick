import { Request, Response } from 'express';
import { RoleService } from '../services/RoleService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class RoleController {
    public static async create(req: Request, res: Response) {
        try {
            const result = await RoleService.create(req.body);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async edit(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await RoleService.edit(Number(id), req.body);
            res.json(result);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await RoleService.remove(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async get(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await RoleService.get(Number(id));
            if (!result) return res.status(404).json(new ErrorResponseDto(undefined, 'Role not found'));
            res.json(result);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async findAll(req: Request, res: Response) {
        try {
            const result = await RoleService.findAll();
            res.json(result);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async search(req: Request, res: Response) {
        try {
            const { keyword } = req.query;
            const result = await RoleService.search(keyword as string);
            res.json(result);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getRoleFunctions(req: Request, res: Response) {
        try {
            const { roleId, moduleId } = req.params;
            const result = await RoleService.getRoleFunctions(Number(roleId), Number(moduleId));
            res.json(result);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateRoleFunctions(req: Request, res: Response) {
        try {
            const { roleId, moduleId } = req.params;
            const result = await RoleService.updateRoleFunctions(Number(roleId), Number(moduleId), req.body);
            res.json(result);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
