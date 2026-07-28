import { prisma } from '@kendrickheller/core';

export class FunctionService {
    public static async getFunctions(moduleId: number) {
        const results = await prisma.function.findMany({
            where: { moduleId, deleteFlg: 0 },
            orderBy: { displayOrder: 'asc' }
        });
        return results.map(r => ({ ...r, functionId: Number(r.functionId), moduleId: Number(r.moduleId) }));
    }

    public static async getFunction(id: number) {
        const result = await prisma.function.findFirst({
            where: { functionId: id, deleteFlg: 0 }
        });
        if (result) {
            return { ...result, functionId: Number(result.functionId), moduleId: Number(result.moduleId) };
        }
        return null;
    }

    public static async createFunction(data: any) {
        const module = await prisma.module.findFirst({
            where: { moduleId: data.moduleId, deleteFlg: 0 }
        });
        if (!module) {
            throw new Error('Module không tồn tại');
        }

        const existing = await prisma.function.findFirst({
            where: { functionName: data.functionName, deleteFlg: 0 }
        });
        if (existing) {
            throw new Error('Tên chức năng đã tồn tại');
        }

        const result = await prisma.function.create({
            data: { ...data }
        });
        return { ...result, functionId: Number(result.functionId), moduleId: Number(result.moduleId) };
    }

    public static async updateFunction(id: number, data: any) {
        if (data.moduleId) {
            const module = await prisma.module.findFirst({
                where: { moduleId: data.moduleId, deleteFlg: 0 }
            });
            if (!module) {
                throw new Error('Module không tồn tại');
            }
        }

        if (data.functionName) {
            const existing = await prisma.function.findFirst({
                where: { functionName: data.functionName, deleteFlg: 0 }
            });
            if (existing && Number(existing.functionId) !== id) {
                throw new Error('Tên chức năng đã tồn tại');
            }
        }

        const fn = await prisma.function.findFirst({
            where: { functionId: id, deleteFlg: 0 }
        });
        if (!fn) {
            throw new Error('Chức năng không tồn tại');
        }

        const result = await prisma.function.update({
            where: { functionId: id },
            data: { ...data }
        });
        return { ...result, functionId: Number(result.functionId), moduleId: Number(result.moduleId) };
    }

    public static async deleteFunction(id: number) {
        const fn = await prisma.function.findFirst({
            where: { functionId: id, deleteFlg: 0 }
        });
        if (!fn) {
            throw new Error('Chức năng không tồn tại');
        }

        await prisma.function.update({
            where: { functionId: id },
            data: { deleteFlg: 1 }
        });
        return true;
    }
}
