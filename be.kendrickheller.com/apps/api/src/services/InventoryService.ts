import { prisma } from '@kendrickheller/core';

export class InventoryService {
    public static async getInventories(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            // Note: Update to matching field if keyword search is needed. Currently mapping to note.
            whereClause.note = { contains: keyword, mode: 'insensitive' };
        }

        const [total, data] = await Promise.all([
            prisma.inventory.count({ where: whereClause }),
            prisma.inventory.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getInventoryById(id: number) {
        return prisma.inventory.findUnique({
            where: { inventoryId: id }
        });
    }

    public static async createInventory(data: any) {
        return prisma.inventory.create({
            data: { ...data }
        });
    }

    public static async updateInventory(id: number, data: any) {
        return prisma.inventory.update({
            where: { inventoryId: id },
            data: { ...data }
        });
    }

    public static async deleteInventory(id: number) {
        return prisma.inventory.update({
            where: { inventoryId: id },
            data: { deleteFlg: 1 }
        });
    }
}
