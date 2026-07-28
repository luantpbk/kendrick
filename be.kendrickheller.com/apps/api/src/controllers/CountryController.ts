import { Request, Response } from 'express';
import { CountryService } from '../services/CountryService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class CountryController {
    public static async getCountries(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const countries = await CountryService.getCountries(
                keyword as string,
                pSize,
                pPage
            );

            res.json(countries);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getCountryById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const country = await CountryService.getCountryById(Number(id));
            if (!country) return res.status(404).json(new ErrorResponseDto(undefined, 'Country not found'));
            res.json(country);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createCountry(req: Request, res: Response) {
        try {
            const country = await CountryService.createCountry(req.body);
            res.status(201).json(country);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateCountry(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const country = await CountryService.updateCountry(Number(id), req.body);
            res.json(country);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteCountry(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await CountryService.deleteCountry(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
