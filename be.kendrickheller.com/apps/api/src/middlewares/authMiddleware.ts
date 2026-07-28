import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { GlobalException, ErrorResponseDto, IEnumError } from '@kendrickheller/core';

// Custom Request to hold user info
export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(new ErrorResponseDto(undefined, 'Missing or invalid token'));
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json(new ErrorResponseDto(undefined, 'Expired or invalid token'));
    }
};
