import { Request, Response } from 'express';
import { AudioBookSeriesService } from '../services/AudioBookSeriesService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class AudioBookSeriesController {
    public static async getAudioBookSeries(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const results = await AudioBookSeriesService.getAudioBookSeries(
                keyword as string,
                pSize,
                pPage
            );

            res.json(results);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getAudioBookSeriesById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await AudioBookSeriesService.getAudioBookSeriesById(Number(id));
            if (!item) return res.status(404).json(new ErrorResponseDto(undefined, 'Not found'));
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createAudioBookSeries(req: Request, res: Response) {
        try {
            const item = await AudioBookSeriesService.createAudioBookSeries(req.body);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateAudioBookSeries(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await AudioBookSeriesService.updateAudioBookSeries(Number(id), req.body);
            res.json(item);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteAudioBookSeries(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await AudioBookSeriesService.deleteAudioBookSeries(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
