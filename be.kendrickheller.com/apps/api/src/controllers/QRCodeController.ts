import { Request, Response } from 'express';
import { QRCodeService } from '../services/QRCodeService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class QRCodeController {
    public static async generateQRCode(req: Request, res: Response) {
        try {
            const { data } = req.body;
            if (!data) {
                return res.status(400).json(new ErrorResponseDto(undefined, 'Data is required'));
            }
            const qrCode = await QRCodeService.generateQRCode(data);
            res.json({ qrCode });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async decodeQRCode(req: Request, res: Response) {
        try {
            if (!(req as any).file) {
                return res.status(400).json(new ErrorResponseDto(undefined, 'Image file is required'));
            }
            const decoded = await QRCodeService.decodeQRCode((req as any).file.buffer);
            res.json({ decoded });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
