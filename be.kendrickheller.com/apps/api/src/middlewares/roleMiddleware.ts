import { Response, NextFunction } from 'express';
import { prisma, ErrorResponseDto } from '@kendrickheller/core';
import { AuthRequest } from './authMiddleware';

const HTTP_METHOD_MAP: Record<string, number> = {
    'GET': 1,
    'POST': 2,
    'PUT': 3,
    'DELETE': 4
};

export const roleMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user || !user.userId) {
            return res.status(401).json(new ErrorResponseDto(undefined, 'Unauthorized'));
        }

        // e.g. req.baseUrl = '/pgidm/rest-api', req.route.path = '/user/:id'
        // J2EE uses: /user/{id}
        const routePath = req.baseUrl + req.route.path; 
        const routerStr = routePath.replace(/:([^\/]+)/g, '{$1}');
        
        const methodId = HTTP_METHOD_MAP[req.method.toUpperCase()];
        if (!methodId) {
            return next(); // Ignore OPTIONS, etc.
        }

        // Find Api
        const api = await prisma.api.findFirst({
            where: {
                router: routerStr,
                methodId: methodId,
                deleteFlg: 0
            }
        });

        if (!api) {
            // Bypass role check if API is not in DB (allowed by default for authenticated users)
            return next(); 
        }

        const apiFunctions = await prisma.apiFunction.findMany({
            where: { apiId: api.apiId }
        });

        if (apiFunctions.length === 0) {
            return res.status(403).json(new ErrorResponseDto(undefined, 'Permission not existed'));
        }

        // Get user's roles
        const userRoles = await prisma.userRole.findMany({
            where: { userId: BigInt(user.userId) }
        });
        
        if (userRoles.length === 0) {
            return res.status(403).json(new ErrorResponseDto(undefined, 'Permission access denied'));
        }

        const roleIds = userRoles.map(ur => ur.roleId);

        // Get role functions
        const roleFunctions = await prisma.roleFunction.findMany({
            where: { roleId: { in: roleIds } }
        });

        let hasPermission = false;
        for (const apiFunc of apiFunctions) {
            if (hasPermission) break;
            for (const roleFunc of roleFunctions) {
                if (roleFunc.functionId === apiFunc.functionId) {
                    const reqAction = Number(api.actionTypeId);
                    const userPerm = Number(roleFunc.permision);
                    if ((userPerm & reqAction) === reqAction) {
                        hasPermission = true;
                        break;
                    }
                }
            }
        }

        if (!hasPermission) {
            return res.status(403).json(new ErrorResponseDto(undefined, 'Permission access denied'));
        }

        next();
    } catch (err: any) {
        return res.status(401).json(new ErrorResponseDto(undefined, err.message));
    }
};
