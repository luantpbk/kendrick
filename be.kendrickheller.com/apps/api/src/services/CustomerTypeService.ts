import { prisma } from '@kendrickheller/core';

export class CustomerTypeService {
    public static async getCustomerTypes(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { customer_type_title: { contains: keyword, mode: 'insensitive' } },
                { customer_typeCode: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.customerType.count({ where: whereClause }),
            prisma.customerType.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getCustomerTypeById(id: number) {
        return prisma.customerType.findUnique({
            where: { customerTypeId: id }
        });
    }

    public static async createCustomerType(data: any) {
        return prisma.customerType.create({
            data: { ...data }
        });
    }

    public static async updateCustomerType(id: number, data: any) {
        return prisma.customerType.update({
            where: { customerTypeId: id },
            data: { ...data }
        });
    }

    public static async deleteCustomerType(id: number) {
        return prisma.customerType.update({
            where: { customerTypeId: id },
            data: { deleteFlg: 1 }
        });
    }
}
