import { Request, Response } from 'express';
import { FileService } from '../services/FileService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class FileController {
    public static async getImages(req: Request, res: Response) {
        try {
            const images = await FileService.getImages();
            res.json(images);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async uploadImage(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json(new ErrorResponseDto(undefined, "No file uploaded"));
            }
            const image = await FileService.uploadImage(req.file);
            res.json(image);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async registerExistingImage(req: Request, res: Response) {
        try {
            const { systemName } = req.body;
            if (!systemName) {
                return res.status(400).json(new ErrorResponseDto(undefined, "Missing systemName parameter"));
            }
            const image = await FileService.registerExistingImage(systemName);
            res.json(image);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async checkImageUsage(req: Request, res: Response) {
        try {
            const fileId = Number(req.params.id);
            if (!fileId) return res.status(400).json(new ErrorResponseDto(undefined, 'Invalid file ID'));
            const usages = await FileService.checkImageUsage(fileId);
            res.json(usages);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteImage(req: Request, res: Response) {
        try {
            const fileId = Number(req.params.id);
            if (!fileId) return res.status(400).json(new ErrorResponseDto(undefined, 'Invalid file ID'));
            const result = await FileService.deleteImage(fileId);
            if (result) res.json(true);
            else res.status(404).json(new ErrorResponseDto(undefined, 'File not found'));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
