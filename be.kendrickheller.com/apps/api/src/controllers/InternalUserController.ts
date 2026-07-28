import { Request, Response } from 'express';
import { InternalUserService } from '../services/InternalUserService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class InternalUserController {
    public static async getByLoginNames(req: Request, res: Response) {
        try {
            const loginNames = req.body;
            if (!Array.isArray(loginNames)) {
                return res.status(400).json(new ErrorResponseDto(undefined, 'Expected an array of login names'));
            }
            const users = await InternalUserService.getByLoginNames(loginNames);
            res.json(users);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getByIds(req: Request, res: Response) {
        try {
            const ids = req.body;
            if (!Array.isArray(ids)) {
                return res.status(400).json(new ErrorResponseDto(undefined, 'Expected an array of ids'));
            }
            const numericIds = ids.map(Number).filter((n: number) => !isNaN(n));
            const users = await InternalUserService.getByIds(numericIds);
            res.json(users);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await InternalUserService.getById(Number(id));
            if (!user) return res.status(404).json(new ErrorResponseDto(undefined, 'User not found'));
            res.json(user);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getRoleFunctions(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const functions = await InternalUserService.getRoleFunctions(Number(id));
            res.json(functions);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getUsersByRole(req: Request, res: Response) {
        try {
            const { roleName } = req.params;
            const users = await InternalUserService.getUsersByRole(roleName);
            res.json(users);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
