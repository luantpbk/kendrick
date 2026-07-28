import { Request, Response } from 'express';
import { OrderRequirementService } from '../services/OrderRequirementService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class OrderRequirementController {
    public static async getOrderRequirements(req: Request, res: Response) {
        try {
            const { size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;

            const orderRequirements = await OrderRequirementService.getOrderRequirements(pSize, pPage);
            res.json(orderRequirements);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getOrderRequirementById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const orderRequirement = await OrderRequirementService.getOrderRequirementById(Number(id));
            if (!orderRequirement) return res.status(404).json(new ErrorResponseDto(undefined, 'OrderRequirement not found'));
            res.json(orderRequirement);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createOrderRequirement(req: Request, res: Response) {
        try {
            const orderRequirement = await OrderRequirementService.createOrderRequirement(req.body);
            res.status(201).json(orderRequirement);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateOrderRequirement(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const orderRequirement = await OrderRequirementService.updateOrderRequirement(Number(id), req.body);
            res.json(orderRequirement);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteOrderRequirement(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await OrderRequirementService.deleteOrderRequirement(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getMyOrderRequirements(req: Request, res: Response) {
        try {
            res.json({ count: 0, items: [] });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updatePayment(req: Request, res: Response) {
        try {
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getAdminOrderRequirement(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await OrderRequirementService.getOrderRequirementById(Number(id));
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
