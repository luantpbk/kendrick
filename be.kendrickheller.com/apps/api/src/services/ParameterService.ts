import { prisma } from '@kendrickheller/core';

export class ParameterService {
    private static mapData(row: any) {
        if (!row) return null;
        const parameters: Record<string, string> = {
            "OtherPrice": "Phí bì thư",
            "ExchangeRateDifference": "Phí chênh tỷ giá",
            "FreeShipDistance": "Khoảng cách miễn phí vận chuyển",
            "ShipDistance01": "Khoảng cách vận chuyển cấp 1",
            "ShipDistance02": "Khoảng cách vận chuyển cấp 2",
            "MaxShipDistance": "Khoảng cách vận chuyển tối đa",
            "ShipFee01": "Phí vận chuyển cấp 1",
            "ShipFee02": "Phí vận chuyển cấp 2",
            "MaxShipFee": "Phí vận tối đa"
        };
        return {
            ...row,
            parameterTitle: parameters[row.parameterKey] || row.parameterKey,
            parameterId: Number(row.parameterId)
        };
    }

    public static async getParameters(
        size: number = 20,
        page: number = 0,
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        const [total, data] = await Promise.all([
            prisma.parameter.count({ where: whereClause }),
            prisma.parameter.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data.map(d => this.mapData(d)), page, size };
    }

    public static async getParameterById(id: number) {
        const data = await prisma.parameter.findUnique({
            where: { parameterId: id }
        });
        return this.mapData(data);
    }

    public static async createParameter(data: any) {
        return prisma.parameter.create({
            data: { ...data }
        });
    }

    public static async updateParameter(id: number, data: any) {
        return prisma.parameter.update({
            where: { parameterId: id },
            data: { ...data }
        });
    }

    public static async deleteParameter(id: number) {
        return prisma.parameter.update({
            where: { parameterId: id },
            data: { deleteFlg: 1 }
        });
    }
}
