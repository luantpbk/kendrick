import { Request, Response } from 'express';
import { AudioChapterService } from '../services/AudioChapterService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class AudioChapterController {
    public static async getAudioChapters(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const results = await AudioChapterService.getAudioChapters(
                keyword as string,
                pSize,
                pPage
            );

            res.json(results);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getAudioChapterById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await AudioChapterService.getAudioChapterById(Number(id));
            if (!item) return res.status(404).json(new ErrorResponseDto(undefined, 'Not found'));
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createAudioChapter(req: Request, res: Response) {
        try {
            const item = await AudioChapterService.createAudioChapter(req.body);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateAudioChapter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await AudioChapterService.updateAudioChapter(Number(id), req.body);
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteAudioChapter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await AudioChapterService.deleteAudioChapter(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
