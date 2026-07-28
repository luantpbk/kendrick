import { prisma } from '@kendrickheller/core';

export class AccountHistoryService {
    private static getAccountActionInfo(type: number) {
        const actions = [
            { coefficient: 1, title: "Nạp tiền vào tài khoản" },
            { coefficient: -1, title: "Trừ tiền trong tài khoản" },
            { coefficient: -1, title: "Thanh toán tiền Sim" },
            { coefficient: -1, title: "Thanh toán cước tháng Sim" },
            { coefficient: -1, title: "Thanh toán tiền mua hộ" },
            { coefficient: -1, title: "Thanh toán phí vận chuyển" },
            { coefficient: -1, title: "Thanh toán tiền cọc Sim" }
        ];
        if (type >= 0 && type < actions.length) {
            return actions[type];
        }
        return { coefficient: 0, title: "" };
    }

    private static mapData(row: any) {
        if (!row) return null;
        const info = this.getAccountActionInfo(Number(row.accountActionType) || 0);
        return {
            ...row,
            accountActionTitle: info.title,
            coefficient: info.coefficient,
            accountHistoryId: Number(row.accountHistoryId)
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
            prisma.accountHistory.count({ where: whereClause }),
            prisma.accountHistory.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data.map(d => this.mapData(d)), page, size };
    }

    public static async getById(id: number) {
        const data = await prisma.accountHistory.findUnique({
            where: { accountHistoryId: BigInt(id) }
        });
        return this.mapData(data);
    }

    public static async create(data: any) {
        return prisma.accountHistory.create({
            data: { ...data }
        });
    }

    public static async update(id: number, data: any) {
        return prisma.accountHistory.update({
            where: { accountHistoryId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async delete(id: number) {
        return prisma.accountHistory.update({
            where: { accountHistoryId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }
}
