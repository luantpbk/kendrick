import { PrismaClient, Prisma } from '@prisma/client';
import { RequestContext } from '../context/RequestContext';

const basePrisma = new PrismaClient();

// Extract models that have specific fields
const models = Prisma.dmmf.datamodel.models;
const modelHasField = (modelName: string, fieldName: string) => {
    const model = models.find(m => m.name === modelName);
    return model?.fields.some(f => f.name === fieldName) ?? false;
};

export const prisma = basePrisma.$extends({
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                const loginName = RequestContext.getLoginName() || 'system';
                
                // If model has deleteFlg, we handle soft deletes
                const hasDeleteFlg = model && modelHasField(model, 'deleteFlg');
                const hasCreatedBy = model && modelHasField(model, 'createdBy');
                const hasCreatedAt = model && modelHasField(model, 'createdAt');
                const hasUpdatedBy = model && modelHasField(model, 'updatedBy');
                const hasUpdatedAt = model && modelHasField(model, 'updatedAt');

                let anyArgs = args as any;
                anyArgs = anyArgs || {};

                if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(operation)) {
                    if (hasDeleteFlg) {
                        anyArgs.where = { ...anyArgs.where, deleteFlg: 0 };
                    }
                }

                if (operation === 'create') {
                    anyArgs.data = anyArgs.data || {};
                    if (hasDeleteFlg) anyArgs.data.deleteFlg = 0;
                    if (hasCreatedAt && anyArgs.data.createdAt === undefined) anyArgs.data.createdAt = new Date();
                    if (hasCreatedBy && anyArgs.data.createdBy === undefined) anyArgs.data.createdBy = loginName;
                }
                
                if (operation === 'createMany') {
                    anyArgs.data = anyArgs.data || {};
                    if (Array.isArray(anyArgs.data)) {
                        anyArgs.data.forEach((item: any) => {
                            if (hasDeleteFlg) item.deleteFlg = 0;
                            if (hasCreatedAt && item.createdAt === undefined) item.createdAt = new Date();
                            if (hasCreatedBy && item.createdBy === undefined) item.createdBy = loginName;
                        });
                    } else if (anyArgs.data) {
                        if (hasDeleteFlg) anyArgs.data.deleteFlg = 0;
                        if (hasCreatedAt && anyArgs.data.createdAt === undefined) anyArgs.data.createdAt = new Date();
                        if (hasCreatedBy && anyArgs.data.createdBy === undefined) anyArgs.data.createdBy = loginName;
                    }
                }

                if (operation === 'update') {
                    anyArgs.data = anyArgs.data || {};
                    if (hasUpdatedAt && anyArgs.data.updatedAt === undefined) anyArgs.data.updatedAt = new Date();
                    if (hasUpdatedBy && anyArgs.data.updatedBy === undefined) anyArgs.data.updatedBy = loginName;
                }
                
                if (operation === 'updateMany') {
                    anyArgs.data = anyArgs.data || {};
                    if (hasUpdatedAt && anyArgs.data.updatedAt === undefined) anyArgs.data.updatedAt = new Date();
                    if (hasUpdatedBy && anyArgs.data.updatedBy === undefined) anyArgs.data.updatedBy = loginName;
                }

                if (operation === 'delete') {
                    if (hasDeleteFlg && model) {
                        const modelDelegate = (basePrisma as any)[model.charAt(0).toLowerCase() + model.slice(1)];
                        return modelDelegate.update({
                            where: anyArgs.where,
                            data: {
                                deleteFlg: 1,
                                ...(hasUpdatedBy ? { updatedBy: loginName } : {}),
                                ...(hasUpdatedAt ? { updatedAt: new Date() } : {})
                            }
                        });
                    }
                }
                
                if (operation === 'deleteMany') {
                    if (hasDeleteFlg && model) {
                        const modelDelegate = (basePrisma as any)[model.charAt(0).toLowerCase() + model.slice(1)];
                        return modelDelegate.updateMany({
                            where: anyArgs.where,
                            data: {
                                deleteFlg: 1,
                                ...(hasUpdatedBy ? { updatedBy: loginName } : {}),
                                ...(hasUpdatedAt ? { updatedAt: new Date() } : {})
                            }
                        });
                    }
                }

                return query(anyArgs);
            }
        }
    }
});
