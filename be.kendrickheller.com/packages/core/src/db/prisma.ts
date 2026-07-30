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

                args = args || {};

                if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(operation)) {
                    if (hasDeleteFlg) {
                        args.where = { ...args.where, deleteFlg: 0 };
                    }
                }

                if (operation === 'create') {
                    args.data = args.data || {};
                    if (hasDeleteFlg) args.data.deleteFlg = 0;
                    if (hasCreatedAt && args.data.createdAt === undefined) args.data.createdAt = new Date();
                    if (hasCreatedBy && args.data.createdBy === undefined) args.data.createdBy = loginName;
                }
                
                if (operation === 'createMany') {
                    args.data = args.data || {};
                    if (Array.isArray(args.data)) {
                        args.data.forEach(item => {
                            if (hasDeleteFlg) item.deleteFlg = 0;
                            if (hasCreatedAt && item.createdAt === undefined) item.createdAt = new Date();
                            if (hasCreatedBy && item.createdBy === undefined) item.createdBy = loginName;
                        });
                    } else if (args.data) {
                        if (hasDeleteFlg) args.data.deleteFlg = 0;
                        if (hasCreatedAt && args.data.createdAt === undefined) args.data.createdAt = new Date();
                        if (hasCreatedBy && args.data.createdBy === undefined) args.data.createdBy = loginName;
                    }
                }

                if (operation === 'update') {
                    args.data = args.data || {};
                    if (hasUpdatedAt && args.data.updatedAt === undefined) args.data.updatedAt = new Date();
                    if (hasUpdatedBy && args.data.updatedBy === undefined) args.data.updatedBy = loginName;
                }
                
                if (operation === 'updateMany') {
                    args.data = args.data || {};
                    if (hasUpdatedAt && args.data.updatedAt === undefined) args.data.updatedAt = new Date();
                    if (hasUpdatedBy && args.data.updatedBy === undefined) args.data.updatedBy = loginName;
                }

                if (operation === 'delete') {
                    if (hasDeleteFlg && model) {
                        const modelDelegate = (basePrisma as any)[model.charAt(0).toLowerCase() + model.slice(1)];
                        return modelDelegate.update({
                            where: args.where,
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
                            where: args.where,
                            data: {
                                deleteFlg: 1,
                                ...(hasUpdatedBy ? { updatedBy: loginName } : {}),
                                ...(hasUpdatedAt ? { updatedAt: new Date() } : {})
                            }
                        });
                    }
                }

                return query(args);
            }
        }
    }
});
