import { prisma } from '@kendrickheller/core';

export class InternalUserService {
    public static async getByLoginNames(loginNames: string[]) {
        return prisma.user.findMany({
            where: {
                loginName: { in: loginNames },
                deleteFlg: 0
            }
        });
    }

    public static async getByIds(ids: number[]) {
        return prisma.user.findMany({
            where: {
                userId: { in: ids },
                deleteFlg: 0
            }
        });
    }

    public static async getById(id: number) {
        return prisma.user.findUnique({
            where: { userId: id }
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

    public static async getUsersByRole(roleName: string) {
        const role = await prisma.role.findFirst({
            where: { roleName, deleteFlg: 0 }
        });
        if (!role) return [];

        const userRoles = await prisma.userRole.findMany({
            where: { roleId: role.roleId }
        });
        const userIds = userRoles.map(ur => Number(ur.userId));

        return this.getByIds(userIds);
    }
}
