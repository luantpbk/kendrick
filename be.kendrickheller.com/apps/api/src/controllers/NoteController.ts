import { Request, Response } from 'express';
import { NoteService } from '../services/NoteService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class NoteController {
    public static async getNotes(req: Request, res: Response) {
        try {
            const { size, page } = req.query;
            
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;

            const notes = await NoteService.getNotes(pSize, pPage);
            res.json(notes);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getNoteById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const note = await NoteService.getNoteById(Number(id));
            if (!note) return res.status(404).json(new ErrorResponseDto(undefined, 'Note not found'));
            res.json(note);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async createNote(req: Request, res: Response) {
        try {
            const note = await NoteService.createNote(req.body);
            res.status(201).json(note);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateNote(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const note = await NoteService.updateNote(Number(id), req.body);
            res.json(note);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteNote(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await NoteService.deleteNote(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
