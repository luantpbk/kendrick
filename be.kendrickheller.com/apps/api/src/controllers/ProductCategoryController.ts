import { Request, Response } from 'express';
import { ProductCategoryService } from '../services/ProductCategoryService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class ProductCategoryController {
    public static async getAttributes(req: Request, res: Response) {
        try {
            const attributes = await ProductCategoryService.getAttributes();
            res.json(attributes);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getAllCategories(req: Request, res: Response) {
        try {
            const { keyword, realmId } = req.query;
            const rId = realmId ? Number(realmId) : undefined;
            const categories = await ProductCategoryService.getAllCategories(keyword as string, rId);
            res.json(categories);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getCategoryById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const category = await ProductCategoryService.getCategoryById(Number(id));
            if (!category) return res.status(404).json(new ErrorResponseDto(undefined, 'ProductCategory not found'));
            res.json(category);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createCategory(req: Request, res: Response) {
        try {
            const category = await ProductCategoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const category = await ProductCategoryService.updateCategory(Number(id), req.body);
            res.json(category);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ProductCategoryService.deleteCategory(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getCategoryDisplayOption(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const config = await ProductCategoryService.getCategoryDisplayOption(Number(id));
            res.json(config);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateCategoryDisplayOption(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const config = await ProductCategoryService.updateCategoryDisplayOption(Number(id), req.body);
            res.json(config);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getCategoryAttributesByIds(req: Request, res: Response) {
        try {
            let ids = req.body;
            
            if (ids && typeof ids === 'object' && !Array.isArray(ids)) {
                if (ids.ids && Array.isArray(ids.ids)) {
                    ids = ids.ids;
                } else if (ids.data && Array.isArray(ids.data)) {
                    ids = ids.data;
                } else {
                    ids = Object.values(ids);
                }
            }

            if (typeof ids === 'string') {
                try { ids = JSON.parse(ids); } catch(e) {}
            }

            if (!Array.isArray(ids)) {
                return res.status(400).json(new ErrorResponseDto(undefined, `Invalid input, expected an array of ids. Received: ${JSON.stringify(req.body)}`));
            }

            const numericIds = ids.map(Number).filter((n: number) => !isNaN(n));
            const attributes = await ProductCategoryService.getCategoryAttributesByIds(numericIds);
            res.json(attributes);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async uploadAvatar(req: Request, res: Response) {
        try {
            if (!req.file) return res.status(400).json(new ErrorResponseDto(undefined, 'No file uploaded'));
            res.json({ fileId: Date.now().toString(), fileName: req.file.filename, url: `/uploads/${req.file.filename}` });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
