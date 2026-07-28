import { prisma } from '@kendrickheller/core';
import bcrypt from 'bcrypt';

export class UserService {
    public static async findAll() {
        return prisma.user.findMany({ where: { deleteFlg: 0 } });
    }

    public static async create(data: any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return prisma.user.create({ data });
    }

    public static async update(id: number, data: any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return prisma.user.update({
            where: { userId: id },
            data
        });
    }

    public static async getUserById(id: number) {
        return prisma.user.findUnique({
            where: { userId: id }
        });
    }

    public static async delete(id: number) {
        return prisma.user.update({
            where: { userId: id },
            data: { deleteFlg: 1 }
        });
    }

    public static async search(keyword?: string, size: number = 20, page: number = 0) {
        const whereClause: any = { deleteFlg: 0 };
        if (keyword) {
            whereClause.OR = [
                { fullName: { contains: keyword, mode: 'insensitive' } },
                { loginName: { contains: keyword, mode: 'insensitive' } },
                { email: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, items] = await Promise.all([
            prisma.user.count({ where: whereClause }),
            prisma.user.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size
            })
        ]);

        return { count: total, items, page, size };
    }

    public static async searchByEmail(email: string) {
        return prisma.user.findFirst({
            where: { email, deleteFlg: 0 }
        });
    }

    public static async searchLoginName(loginName: string) {
        return prisma.user.findFirst({
            where: { loginName, deleteFlg: 0 }
        });
    }

    public static async count() {
        return prisma.user.count({ where: { deleteFlg: 0 } });
    }

    public static async getRoles(userId: number) {
        const userRoles = await prisma.userRole.findMany({
            where: { userId }
        });
        const roleIds = userRoles.map(ur => Number(ur.roleId));
        return prisma.role.findMany({
            where: { roleId: { in: roleIds } }
        });
    }

    public static async addUserRole(userId: number, roleId: number) {
        return prisma.userRole.create({
            data: { userId, roleId }
        });
    }

    public static async deleteUserRole(userId: number, roleId: number) {
        return prisma.userRole.delete({
            where: {
                userId_roleId: { userId, roleId }
            }
        });
    }

    public static async getRoleFunctions(userId: number) {
        const userRoles = await prisma.userRole.findMany({
            where: { userId }
        });
        const roleIds = userRoles.map(ur => Number(ur.roleId));
        const roleFunctions = await prisma.roleFunction.findMany({
            where: { roleId: { in: roleIds } }
        });
        return roleFunctions.map(rf => {
            const permision = rf.permision;
            return {
                ...rf,
                roleId: Number(rf.roleId),
                functionId: Number(rf.functionId),
                actions: {
                    View: (permision & 1) === 1,
                    Add: (permision & 2) === 2,
                    Edit: (permision & 4) === 4,
                    Delete: (permision & 8) === 8,
                    Confirm: (permision & 16) === 16
                }
            };
        });
    }

    public static async getFunctions(userId: number) {
        const roleFunctions = await this.getRoleFunctions(userId);
        const functionIds = roleFunctions.map(rf => Number(rf.functionId));
        return prisma.function.findMany({
            where: { functionId: { in: functionIds } }
        });
    }
}
