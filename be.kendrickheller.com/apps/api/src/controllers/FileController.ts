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
}
