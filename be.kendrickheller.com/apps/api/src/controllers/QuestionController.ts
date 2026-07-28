import { Request, Response } from 'express';
import { QuestionService } from '../services/QuestionService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class QuestionController {
    public static async getQuestions(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            
            const questions = await QuestionService.getQuestions(
                keyword as string,
                pSize,
                pPage
            );

            res.send(JSON.stringify(questions, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getQuestionById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const question = await QuestionService.getQuestionById(BigInt(id));
            if (!question) {
                return res.status(404).json(new ErrorResponseDto(undefined, 'Question not found'));
            }
            res.send(JSON.stringify(question, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createQuestion(req: Request, res: Response) {
        try {
            const question = await QuestionService.createQuestion(req.body);
            res.status(201).send(JSON.stringify(question, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateQuestion(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const question = await QuestionService.updateQuestion(BigInt(id), req.body);
            res.send(JSON.stringify(question, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteQuestion(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await QuestionService.deleteQuestion(BigInt(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
