import { Request, Response } from 'express';
import { InventoryService } from '../services/InventoryService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class InventoryController {
    public static async getInventories(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const inventories = await InventoryService.getInventories(
                keyword as string,
                pSize,
                pPage
            );

            res.json(inventories);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getInventoryById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const inventory = await InventoryService.getInventoryById(Number(id));
            if (!inventory) return res.status(404).json(new ErrorResponseDto(undefined, 'Inventory not found'));
            res.json(inventory);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createInventory(req: Request, res: Response) {
        try {
            const inventory = await InventoryService.createInventory(req.body);
            res.status(201).json(inventory);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateInventory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const inventory = await InventoryService.updateInventory(Number(id), req.body);
            res.json(inventory);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteInventory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await InventoryService.deleteInventory(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
