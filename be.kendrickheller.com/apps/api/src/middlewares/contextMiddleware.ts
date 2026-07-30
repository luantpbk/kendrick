import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '@kendrickheller/core';


export const contextMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // We create a mutable context object so that downstream middlewares 
    // (like authMiddleware) can update it once the user is authenticated.
    const context = {
        userId: undefined as any,
        loginName: 'system',
        roles: [] as string[],
    };

    RequestContext.run(context, () => {
        next();
    });
};
