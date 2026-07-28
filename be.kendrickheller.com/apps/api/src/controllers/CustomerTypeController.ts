import { Request, Response } from 'express';
import { CustomerTypeService } from '../services/CustomerTypeService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class CustomerTypeController {
    public static async getCustomerTypes(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const customerTypes = await CustomerTypeService.getCustomerTypes(
                keyword as string,
                pSize,
                pPage
            );

            res.json(customerTypes);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getCustomerTypeById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const customerType = await CustomerTypeService.getCustomerTypeById(Number(id));
            if (!customerType) return res.status(404).json(new ErrorResponseDto(undefined, 'Customer Type not found'));
            res.json(customerType);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createCustomerType(req: Request, res: Response) {
        try {
            const customerType = await CustomerTypeService.createCustomerType(req.body);
            res.status(201).json(customerType);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateCustomerType(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const customerType = await CustomerTypeService.updateCustomerType(Number(id), req.body);
            res.json(customerType);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteCustomerType(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await CustomerTypeService.deleteCustomerType(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
