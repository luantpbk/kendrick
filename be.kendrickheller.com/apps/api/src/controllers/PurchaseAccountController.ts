import { Request, Response } from 'express';
import { PurchaseAccountService } from '../services/PurchaseAccountService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class PurchaseAccountController {
    public static async getPurchaseAccounts(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const accounts = await PurchaseAccountService.getPurchaseAccounts(
                keyword as string,
                pSize,
                pPage
            );

            res.send(JSON.stringify(accounts, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getPurchaseAccountById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const account = await PurchaseAccountService.getPurchaseAccountById(BigInt(id));
            if (!account) {
                return res.status(404).json(new ErrorResponseDto(undefined, 'PurchaseAccount not found'));
            }
            res.send(JSON.stringify(account, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createPurchaseAccount(req: Request, res: Response) {
        try {
            const account = await PurchaseAccountService.createPurchaseAccount(req.body);
            res.status(201).send(JSON.stringify(account, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updatePurchaseAccount(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const account = await PurchaseAccountService.updatePurchaseAccount(BigInt(id), req.body);
            res.send(JSON.stringify(account, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deletePurchaseAccount(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await PurchaseAccountService.deletePurchaseAccount(BigInt(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
