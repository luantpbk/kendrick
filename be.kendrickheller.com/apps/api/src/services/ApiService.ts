import { prisma } from '@kendrickheller/core';

export class ApiService {
    public static async getApis() {
        const results = await prisma.api.findMany({
            where: { deleteFlg: 0 },
            orderBy: { displayOrder: 'asc' }
        });
        return results.map(r => ({ ...r, apiId: Number(r.apiId) }));
    }

    public static async getApi(id: number) {
        const result = await prisma.api.findFirst({
            where: { apiId: id, deleteFlg: 0 }
        });
        if (result) {
            return { ...result, apiId: Number(result.apiId) };
        }
        return null;
    }

    public static async getApiByRouterAndMethod(router: string, methodId: number) {
        const result = await prisma.api.findFirst({
            where: { router, methodId, deleteFlg: 0 }
        });
        if (result) {
            return { ...result, apiId: Number(result.apiId) };
        }
        return null;
    }

    public static async createApi(data: any) {
        const result = await prisma.api.create({
            data: { ...data }
        });
        return { ...result, apiId: Number(result.apiId) };
    }

    public static async updateApi(id: number, data: any) {
        const api = await prisma.api.findFirst({
            where: { apiId: id, deleteFlg: 0 }
        });
        if (!api) {
            throw new Error('Api không tồn tại');
        }

        const result = await prisma.api.update({
            where: { apiId: id },
            data: { ...data }
        });
        return { ...result, apiId: Number(result.apiId) };
    }

    public static async deleteApi(id: number) {
        const api = await prisma.api.findFirst({
            where: { apiId: id, deleteFlg: 0 }
        });
        if (!api) {
            throw new Error('Api không tồn tại');
        }

        await prisma.api.update({
            where: { apiId: id },
            data: { deleteFlg: 1 }
        });
        return true;
    }

    public static async getApiFunctions(id: number) {
        const apiFunctions = await prisma.apiFunction.findMany({
            where: { apiId: id }
        });
        const functionIds = apiFunctions.map(af => af.functionId);

        const functions = await prisma.function.findMany({
            where: {
                functionId: { in: functionIds },
                deleteFlg: 0
            }
        });
        return functions.map(f => ({ ...f, functionId: Number(f.functionId), moduleId: Number(f.moduleId) }));
    }

    public static async addApiFunction(id: number, functionId: number) {
        const existing = await prisma.apiFunction.findFirst({
            where: { apiId: id, functionId }
        });
        if (existing) {
            throw new Error('Chức năng đã được khai báo api');
        }

        const result = await prisma.apiFunction.create({
            data: {
                apiId: id,
                functionId
            }
        });
        return { ...result, apiId: Number(result.apiId), functionId: Number(result.functionId) };
    }

    public static async deleteApiFunction(id: number, functionId: number) {
        const existing = await prisma.apiFunction.findFirst({
            where: { apiId: id, functionId }
        });
        if (!existing) {
            throw new Error('Chức năng chưa được khai báo api');
        }

        await prisma.apiFunction.delete({
            where: {
                apiId_functionId: {
                    apiId: id,
                    functionId
                }
            }
        });
        return true;
    }
}
