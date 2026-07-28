import { Request, Response } from 'express';
import { EmailService } from '../services/EmailService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class EmailController {
    public static async getEmails(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const emails = await EmailService.getEmails(
                keyword as string,
                pSize,
                pPage
            );

            res.json(emails);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getEmailById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const email = await EmailService.getEmailById(Number(id));
            if (!email) return res.status(404).json(new ErrorResponseDto(undefined, 'Email not found'));
            res.json(email);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createEmail(req: Request, res: Response) {
        try {
            const email = await EmailService.createEmail(req.body);
            res.status(201).json(email);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateEmail(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const email = await EmailService.updateEmail(Number(id), req.body);
            res.json(email);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteEmail(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await EmailService.deleteEmail(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
