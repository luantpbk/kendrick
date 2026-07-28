import { Request, Response } from 'express';
import { LoginService } from '../services/LoginService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class LoginController {
    public static async login(req: Request, res: Response) {
        try {
            const tokenResponse = await LoginService.login(req.body);
            res.json(tokenResponse);
        } catch (error: any) {
            res.status(401).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async renewToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json(new ErrorResponseDto(undefined, 'refreshToken is required'));
            }
            const tokenResponse = await LoginService.renewToken(refreshToken);
            res.json(tokenResponse);
        } catch (error: any) {
            res.status(401).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async signout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            await LoginService.signout(refreshToken);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
