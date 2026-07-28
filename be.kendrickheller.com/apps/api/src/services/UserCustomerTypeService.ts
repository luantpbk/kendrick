import { prisma } from '@kendrickheller/core';

export class UserCustomerTypeService {
    private static mapData(row: any) {
        if (!row) return null;
        const businessTypes: Record<number, string> = {
            1: "Sim",
            2: "Mua hộ / Vận chuyển",
            3: "Bán hàng"
        };
        return {
            ...row,
            businessTypeTitle: businessTypes[Number(row.businessType)] || "",
            userCustomerTypeId: Number(row.userCustomerTypeId)
        };
    }

    public static async getAll(
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        const [total, data] = await Promise.all([
            prisma.userCustomerType.count({ where: whereClause }),
            prisma.userCustomerType.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data.map(d => this.mapData(d)), page, size };
    }

    public static async getById(id: number) {
        const data = await prisma.userCustomerType.findUnique({
            where: { userCustomerTypeId: BigInt(id) }
        });
        return this.mapData(data);
    }

    public static async create(data: any) {
        return prisma.userCustomerType.create({
            data: { ...data }
        });
    }

    public static async update(id: number, data: any) {
        return prisma.userCustomerType.update({
            where: { userCustomerTypeId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async delete(id: number) {
        return prisma.userCustomerType.update({
            where: { userCustomerTypeId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
