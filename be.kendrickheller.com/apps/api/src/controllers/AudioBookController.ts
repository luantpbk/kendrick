import { Request, Response } from 'express';
import { AudioBookService } from '../services/AudioBookService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class AudioBookController {
    public static async getAudioBooks(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const results = await AudioBookService.getAudioBooks(
                keyword as string,
                pSize,
                pPage
            );

            res.json(results);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getAudioBookById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await AudioBookService.getAudioBookById(Number(id));
            if (!item) return res.status(404).json(new ErrorResponseDto(undefined, 'Not found'));
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createAudioBook(req: Request, res: Response) {
        try {
            const item = await AudioBookService.createAudioBook(req.body);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateAudioBook(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await AudioBookService.updateAudioBook(Number(id), req.body);
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteAudioBook(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await AudioBookService.deleteAudioBook(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
