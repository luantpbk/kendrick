import { prisma } from '@kendrickheller/core';

export class RoleService {
    public static async create(data: any) {
        // check role name existed if needed
        const existing = await prisma.role.findFirst({
            where: { roleName: data.roleName, deleteFlg: 0 }
        });
        if (existing) {
            throw new Error('ROLE_NAME_EXISTED');
        }

        return prisma.role.create({
            data: { ...data }
        });
    }

    public static async edit(roleId: number, data: any) {
        return prisma.role.update({
            where: { roleId },
            data: { ...data }
        });
    }

    public static async remove(roleId: number) {
        return prisma.role.update({
            where: { roleId },
            data: { deleteFlg: 1 }
        });
    }

    public static async get(roleId: number) {
        const result = await prisma.role.findFirst({
            where: { roleId, deleteFlg: 0 }
        });
        if (result) {
            return { ...result, roleId: Number(result.roleId) };
        }
        return result;
    }

    public static async findAll() {
        const results = await prisma.role.findMany({
            where: { deleteFlg: 0 },
            orderBy: { displayOrder: 'asc' } // or createdAt
        });
        return results.map(r => ({ ...r, roleId: Number(r.roleId) }));
    }

    public static async search(keyword: string) {
        const results = await prisma.role.findMany({
            where: {
                roleName: { contains: keyword, mode: 'insensitive' },
                deleteFlg: 0
            }
        });
        return results.map(r => ({ ...r, roleId: Number(r.roleId) }));
    }

    public static async getRoleFunctions(roleId: number, moduleId: number) {
        const functions = await prisma.function.findMany({
            where: { moduleId, deleteFlg: 0 }
        });
        const functionIds = functions.map(f => f.functionId);

        const roleFunctions = await prisma.roleFunction.findMany({
            where: {
                roleId,
                functionId: { in: functionIds }
            }
        });

        return roleFunctions.map(rf => {
            const permision = rf.permision;
            const actions = {
                View: (permision & 1) === 1,
                Add: (permision & 2) === 2,
                Edit: (permision & 4) === 4,
                Delete: (permision & 8) === 8,
                Confirm: (permision & 16) === 16
            };
            return {
                ...rf,
                roleId: Number(rf.roleId),
                functionId: Number(rf.functionId),
                actions
            };
        });
    }

    public static async updateRoleFunctions(roleId: number, moduleId: number, dtos: any[]) {
        const functions = await prisma.function.findMany({
            where: { moduleId, deleteFlg: 0 }
        });
        const functionIds = functions.map(f => f.functionId);

        await prisma.roleFunction.deleteMany({
            where: {
                roleId,
                functionId: { in: functionIds }
            }
        });

        const newRoleFunctions = dtos.map(dto => {
            let permision = 0;
            if (dto.actions) {
                if (dto.actions.View) permision += 1;
                if (dto.actions.Add) permision += 2;
                if (dto.actions.Edit) permision += 4;
                if (dto.actions.Delete) permision += 8;
                if (dto.actions.Confirm) permision += 16;
            }
            return {
                roleId,
                functionId: dto.functionId,
                permision
            };
        });

        if (newRoleFunctions.length > 0) {
            await prisma.roleFunction.createMany({
                data: newRoleFunctions
            });
        }

        return true;
    }
}
