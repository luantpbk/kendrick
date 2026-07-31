import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ErrorResponseDto } from '@kendrickheller/core';

export class UserController {
    public static async findAll(req: Request, res: Response) {
        try {
            const users = await UserService.findAll();
            res.json(users);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async create(req: Request, res: Response) {
        try {
            const user = await UserService.create(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await UserService.update(Number(id), req.body);
            res.json(user);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(Number(id));
            if (!user) return res.status(404).json(new ErrorResponseDto(undefined, 'User not found'));
            res.json(user);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getUserInfo(req: Request, res: Response) {
        try {
            // Assuming req.user is set by auth middleware
            const user = (req as any).user;
            if (!user || !user.userId) return res.status(401).json(new ErrorResponseDto(undefined, 'Unauthorized'));
            const userInfo = await UserService.getUserById(Number(user.userId));
            res.json(userInfo);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updatePassword(req: Request, res: Response) {
        try {
            // Not implemented logic for change password with otp etc.
            res.status(501).json(new ErrorResponseDto(undefined, 'Not Implemented'));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async forgotPassword(req: Request, res: Response) {
        try {
            res.status(501).json(new ErrorResponseDto(undefined, 'Not Implemented'));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await UserService.delete(Number(id));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async search(req: Request, res: Response) {
        try {
            const { keyword, size, page } = req.query;
            const pSize = size ? Number(size) : 20;
            const pPage = page ? Number(page) : 0;
            const users = await UserService.search(keyword as string, pSize, pPage);
            res.json(users);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async loadUserWithPagination(req: Request, res: Response) {
        try {
            const { limit, offset } = req.params;
            const pLimit = limit ? Number(limit) : 20;
            const pOffset = offset ? Number(offset) : 0;
            const users = await UserService.search(undefined, pLimit, pOffset);
            res.json(users.items);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async searchByEmail(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const user = await UserService.searchByEmail(email);
            res.json(user);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async searchLoginName(req: Request, res: Response) {
        try {
            const { loginName } = req.params;
            const user = await UserService.searchLoginName(loginName);
            res.json(user);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async count(req: Request, res: Response) {
        try {
            const count = await UserService.count();
            res.json({ count });
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async register(req: Request, res: Response) {
        try {
            const user = await UserService.create(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async resentOtp(req: Request, res: Response) {
        try {
            res.status(501).json(new ErrorResponseDto(undefined, 'Not Implemented'));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async confirmOtp(req: Request, res: Response) {
        try {
            res.status(501).json(new ErrorResponseDto(undefined, 'Not Implemented'));
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async updateProfile(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user || !user.userId) return res.status(401).json(new ErrorResponseDto(undefined, 'Unauthorized'));
            const updated = await UserService.update(Number(user.userId), req.body);
            res.json(updated);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getRoles(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const roles = await UserService.getRoles(Number(id));
            res.json(roles);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async addUserRole(req: Request, res: Response) {
        try {
            const { id, roleId } = req.params;
            const userRole = await UserService.addUserRole(Number(id), Number(roleId));
            res.status(201).json(userRole);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async deleteUserRole(req: Request, res: Response) {
        try {
            const { id, roleId } = req.params;
            await UserService.deleteUserRole(Number(id), Number(roleId));
            res.json(true);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getRoleFunctions(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const roleFunctions = await UserService.getRoleFunctions(Number(id));
            res.json(roleFunctions);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }

    public static async getFunctions(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const functions = await UserService.getFunctions(Number(id));
            res.json(functions);
        } catch (error: any) {
            res.status(500).json(new ErrorResponseDto(undefined, error.message));
        }
    }
}
