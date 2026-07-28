import { Request, Response } from 'express';
import { ProductRealmService } from '../services/ProductRealmService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class ProductRealmController {
    public static async getAllRealms(req: Request, res: Response) {
        try {
            const { keyword } = req.query;
            const realms = await ProductRealmService.getAllRealms(keyword as string);
            res.json(realms);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getRealmById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const realm = await ProductRealmService.getRealmById(Number(id));
            if (!realm) return res.status(404).json(new ErrorResponseDto(undefined, 'ProductRealm not found'));
            res.json(realm);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createRealm(req: Request, res: Response) {
        try {
            const realm = await ProductRealmService.createRealm(req.body);
            res.status(201).json(realm);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateRealm(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const realm = await ProductRealmService.updateRealm(Number(id), req.body);
            res.json(realm);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteRealm(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ProductRealmService.deleteRealm(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
