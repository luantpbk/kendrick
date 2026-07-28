import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { ErrorResponseDto } from '@kendrickheller/core';

export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.roles) {
            return res.status(403).json(new ErrorResponseDto(undefined, 'Access denied: No roles found'));
        }

        const userRoles: string[] = typeof req.user.roles === 'string' ? JSON.parse(req.user.roles) : req.user.roles;
        
        const hasRole = userRoles.some(role => allowedRoles.includes(role));
        if (!hasRole) {
            return res.status(403).json(new ErrorResponseDto(undefined, 'Access denied: Insufficient privileges'));
        }

        next();
    };
};
