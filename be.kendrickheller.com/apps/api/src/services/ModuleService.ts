import { prisma } from '@kendrickheller/core';

export class ModuleService {
    public static async getModules() {
        const results = await prisma.module.findMany({
            where: { deleteFlg: 0 },
            orderBy: { displayOrder: 'asc' }
        });
        return results.map(r => ({ ...r, moduleId: Number(r.moduleId) }));
    }

    public static async getModule(id: number) {
        const result = await prisma.module.findFirst({
            where: { moduleId: id, deleteFlg: 0 }
        });
        if (result) {
            return { ...result, moduleId: Number(result.moduleId) };
        }
        return null;
    }

    public static async createModule(data: any) {
        const existing = await prisma.module.findFirst({
            where: { moduleName: data.moduleName, deleteFlg: 0 }
        });
        if (existing) {
            throw new Error('Tên module đã tồn tại');
        }

        const result = await prisma.module.create({
            data: { ...data }
        });
        return { ...result, moduleId: Number(result.moduleId) };
    }

    public static async updateModule(id: number, data: any) {
        if (data.moduleName) {
            const existing = await prisma.module.findFirst({
                where: { moduleName: data.moduleName, deleteFlg: 0 }
            });
            if (existing && Number(existing.moduleId) !== id) {
                throw new Error('Tên module đã tồn tại');
            }
        }

        const module = await prisma.module.findFirst({
            where: { moduleId: id, deleteFlg: 0 }
        });
        if (!module) {
            throw new Error('Module không tồn tại');
        }

        const result = await prisma.module.update({
            where: { moduleId: id },
            data: { ...data }
        });
        return { ...result, moduleId: Number(result.moduleId) };
    }

    public static async deleteModule(id: number) {
        const functions = await prisma.function.findMany({
            where: { moduleId: id, deleteFlg: 0 }
        });
        if (functions.length > 0) {
            throw new Error('Module đang tồn tại chức năng');
        }

        const module = await prisma.module.findFirst({
            where: { moduleId: id, deleteFlg: 0 }
        });
        if (!module) {
            throw new Error('Module không tồn tại');
        }

        await prisma.module.update({
            where: { moduleId: id },
            data: { deleteFlg: 1 }
        });
        return true;
    }
}
