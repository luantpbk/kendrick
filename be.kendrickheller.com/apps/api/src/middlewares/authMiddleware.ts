import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { GlobalException, ErrorResponseDto, IEnumError, RequestContext } from '@kendrickheller/core';

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
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=');
        req.user = decoded;
        
        // Update RequestContext
        const context = RequestContext.get();
        if (context) {
            context.userId = decoded.id || decoded.userId;
            context.loginName = decoded.username || decoded.loginName || 'system';
            context.roles = decoded.roles || [];
        }

        next();
    } catch (err) {
        return res.status(401).json(new ErrorResponseDto(undefined, 'Expired or invalid token'));
    }
};
